package utils

import (
	"crypto/sha256"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"volt/db/config"
	"volt/db/models"

	"github.com/gabriel-vasile/mimetype"
)

func ProcessFileUpload(file multipart.File, header *multipart.FileHeader, userID uint, isPrivate bool) (*models.FileUploadResult, error) {
	hashResult, err := calculateFileHash(file)
	if err != nil {
		return nil, err
	}

	if err := validateFileContent(file, header.Header.Get("Content-Type"), header.Filename); err != nil {
		return nil, err
	}

	var existingFile models.File
	fileExists := config.DB.Where("hash = ?", hashResult.Hash).First(&existingFile).Error == nil

	var gormFile models.File
	var wasDuplicate bool

	if fileExists {
		gormFile = existingFile
		wasDuplicate = true
	} else {
		storagePath := filepath.Join("uploads", hashResult.Hash+filepath.Ext(header.Filename))

		if err := saveFileToDisk(file, storagePath); err != nil {
			return nil, err
		}

		gormFile = models.File{
			Hash:           hashResult.Hash,
			OriginalName:   header.Filename,
			MimeType:       hashResult.MimeType,
			Size:           hashResult.Size,
			StoragePath:    storagePath,
			ReferenceCount: 0,
		}

		if err := config.DB.Create(&gormFile).Error; err != nil {
			os.Remove(storagePath)
			return nil, err
		}
	}

	var existingRef models.FileReference
	refExists := config.DB.Where("user_id = ? AND file_id = ?", userID, gormFile.ID).First(&existingRef).Error == nil

	if refExists {
		config.DB.Preload("File").First(&existingRef, existingRef.ID)
		return &models.FileUploadResult{
			FileReference: existingRef,
			File:          existingRef.File,
			WasDuplicate:  true,
			SavedBytes:    existingRef.File.Size,
		}, nil
	}

	fileRef := models.FileReference{
		UserID:      userID,
		FileID:      gormFile.ID,
		DisplayName: header.Filename,
		IsDuplicate: wasDuplicate,
		IsPrivate:   isPrivate,
	}

	if err := config.DB.Create(&fileRef).Error; err != nil {
		if !fileExists {
			config.DB.Delete(&gormFile)
			os.Remove(gormFile.StoragePath)
		}
		return nil, err
	}

	config.DB.Preload("File").First(&fileRef, fileRef.ID)

	savedBytes := int64(0)
	if wasDuplicate {
		savedBytes = gormFile.Size
	}

	return &models.FileUploadResult{
		FileReference: fileRef,
		File:          gormFile,
		WasDuplicate:  wasDuplicate,
		SavedBytes:    savedBytes,
	}, nil
}

func validateFileContent(file multipart.File, declaredMimeType string, filename string) error {
	file.Seek(0, io.SeekStart)
	defer file.Seek(0, io.SeekStart)

	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return fmt.Errorf("failed to read file content: %w", err)
	}

	actualMime := mimetype.Detect(buffer[:n])
	actualMimeType := actualMime.String()

	declaredBase := strings.Split(declaredMimeType, ";")[0]
	actualBase := strings.Split(actualMimeType, ";")[0]

	if !isMimeTypeCompatible(declaredBase, actualBase) {
		return fmt.Errorf("MIME type mismatch for %s: expected %s, got %s - %s",
			filename, declaredBase, actualBase, "file content does not match declared type")
	}

	return nil
}

func isMimeTypeCompatible(declared, actual string) bool {
	if declared == actual {
		return true
	}

	compatibilityMap := map[string][]string{
		"text/plain":                   {"application/octet-stream"},
		"application/octet-stream":     {"text/plain"},
		"image/jpeg":                   {"image/jpg"},
		"image/jpg":                    {"image/jpeg"},
		"application/x-zip-compressed": {"application/zip"},
		"application/zip":              {"application/x-zip-compressed"},
	}

	if compatible, exists := compatibilityMap[declared]; exists {
		for _, compatibleType := range compatible {
			if compatibleType == actual {
				return true
			}
		}
	}

	return false
}

func saveFileToDisk(file multipart.File, storagePath string) error {
	file.Seek(0, 0)

	dir := filepath.Dir(storagePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	dst, err := os.Create(storagePath)
	if err != nil {
		return err
	}
	defer dst.Close()

	return err
}

type FileHashResult struct {
	Hash     string
	Size     int64
	MimeType string
}

func calculateFileHash(file multipart.File) (*FileHashResult, error) {
	file.Seek(0, io.SeekStart)
	defer file.Seek(0, io.SeekStart)

	hasher := sha256.New()
	size, err := io.Copy(hasher, file)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate hash: %w", err)
	}

	file.Seek(0, io.SeekStart)

	buffer := make([]byte, 512)
	n, _ := file.Read(buffer)

	mtype := mimetype.Detect(buffer[:n])

	file.Seek(0, io.SeekStart)

	return &FileHashResult{
		Hash:     fmt.Sprintf("%x", hasher.Sum(nil)),
		Size:     size,
		MimeType: mtype.String(),
	}, nil
}

func GetUserStorageStats(userID int) (*models.UserStorageStats, error) {
	db := config.GetDB()
	if db == nil {
		return nil, fmt.Errorf("database connection not initialized")
	}

	var stats models.UserStorageStats
	stats.UserID = userID

	var totalFiles int64
	if err := db.Model(&models.FileReference{}).Where("user_id = ?", userID).Count(&totalFiles).Error; err != nil {
		return nil, fmt.Errorf("failed to count total files: %w", err)
	}
	stats.TotalFiles = int(totalFiles)

	var uniqueFiles int64
	if err := db.Model(&models.FileReference{}).Where("user_id = ?", userID).Select("DISTINCT file_id").Count(&uniqueFiles).Error; err != nil {
		return nil, fmt.Errorf("failed to count unique files: %w", err)
	}
	stats.UniqueFiles = int(uniqueFiles)

	stats.DuplicateFiles = stats.TotalFiles - stats.UniqueFiles

	var totalSize int64
	result := db.Table("file_references").
		Select("COALESCE(SUM(files.size), 0)").
		Joins("JOIN files ON file_references.file_id = files.id").
		Where("file_references.user_id = ?", userID).
		Scan(&totalSize)

	if result.Error != nil {
		return nil, fmt.Errorf("failed to calculate total size: %w", result.Error)
	}
	stats.TotalSizeBytes = totalSize

	var actualSize int64
	result = db.Table("file_references").
		Select("COALESCE(SUM(DISTINCT files.size), 0)").
		Joins("JOIN files ON file_references.file_id = files.id").
		Where("file_references.user_id = ?", userID).
		Scan(&actualSize)

	if result.Error != nil {
		return nil, fmt.Errorf("failed to calculate actual size: %w", result.Error)
	}
	stats.ActualStorageBytes = actualSize

	stats.SavedBytes = stats.TotalSizeBytes - stats.ActualStorageBytes
	if stats.TotalSizeBytes > 0 {
		stats.SavingsPercentage = float64(stats.SavedBytes) / float64(stats.TotalSizeBytes) * 100
	} else {
		stats.SavingsPercentage = 0
	}

	stats.TotalStorageUsed = totalSize
	stats.TotalDuplicates = stats.DuplicateFiles

	stats.StorageByFileType = make(map[string]int64)

	var fileTypes []struct {
		MimeType string `json:"mime_type"`
		Size     int64  `json:"size"`
	}

	result = db.Table("file_references").
		Select("files.mime_type, SUM(files.size) as size").
		Joins("JOIN files ON file_references.file_id = files.id").
		Where("file_references.user_id = ?", userID).
		Group("files.mime_type").
		Scan(&fileTypes)

	if result.Error == nil {
		for _, ft := range fileTypes {
			stats.StorageByFileType[ft.MimeType] = ft.Size
		}
	}

	return &stats, nil
}
