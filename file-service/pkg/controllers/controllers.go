package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"volt/file-service/pkg/middlewares"
	"volt/file-service/pkg/utils"

	"volt/db/config"
	"volt/db/models"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

const MaxFileSize = 10 * 1024 * 1024 // 10 MB

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{ "database": "connected", "service":"file-service", "status": "healthy"}`))
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	err := r.ParseMultipartForm(MaxFileSize)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to parse form: " + err.Error(),
		})
		return
	}

	userClaims, ok := r.Context().Value(middlewares.UserContextKey).(*utils.Claims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "User information not found",
		})
		return
	}
	userID := userClaims.UserID

	isPrivate := true
	if privacyStr := r.FormValue("is_private"); privacyStr == "false" {
		isPrivate = false
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to get file: " + err.Error(),
		})
		return
	}
	defer file.Close()

	result, err := utils.ProcessFileUpload(file, header, userID, isPrivate)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	stats, err := GetUserStorageStatsData(userID)
	if err != nil {
		log.Printf("Failed to get user stats: %v", err)
		stats = &models.UserStorageStats{UserID: int(userID)}
	}

	response := models.UploadResponse{
		Success:      true,
		Message:      "File uploaded successfully",
		Files:        []models.FileUploadResult{*result},
		StorageStats: *stats,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	userID := vars["ID"]

	var fileRefs []models.FileReference
	result := config.DB.Where("user_id = ?", userID).
		Preload("File", "deleted_at IS NULL").
		Order("created_at DESC").
		Find(&fileRefs)

	if result.Error != nil {
		log.Printf("GetFiles: Database error: %v", result.Error)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to get files: " + result.Error.Error(),
		})
		return
	}

	var files []models.FileResponse
	for _, fileRef := range fileRefs {
		if fileRef.File.ID == 0 {
			continue
		}

		fileData := models.FileResponse{
			ID:          fileRef.ID,
			UserID:      fileRef.UserID,
			FileID:      fileRef.FileID,
			DisplayName: fileRef.DisplayName,
			IsDuplicate: fileRef.IsDuplicate,
			IsPrivate:   fileRef.IsPrivate,
			CreatedAt:   fileRef.CreatedAt,
			UpdatedAt:   fileRef.UpdatedAt,
			File: models.File{
				ID:             fileRef.File.ID,
				Hash:           fileRef.File.Hash,
				OriginalName:   fileRef.File.OriginalName,
				MimeType:       fileRef.File.MimeType,
				Size:           fileRef.File.Size,
				StoragePath:    fileRef.File.StoragePath,
				ReferenceCount: fileRef.File.ReferenceCount,
				CreatedAt:      fileRef.File.CreatedAt,
			},
		}
		files = append(files, fileData)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(files)
}

func DeleteFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	fileRefID, err := strconv.ParseUint(vars["ID"], 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid file reference ID",
		})
		return
	}

	userClaims, ok := r.Context().Value(middlewares.UserContextKey).(*utils.Claims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "User information not found",
		})
		return
	}
	userID := userClaims.UserID

	var fileRef models.FileReference
	result := config.DB.Where("id = ? AND user_id = ?", uint(fileRefID), userID).First(&fileRef)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "File not found",
			})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error: " + result.Error.Error(),
		})
		return
	}

	if err := config.DB.Delete(&fileRef).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to delete file: " + err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "File deleted successfully",
	})
}

func GetUserStorageStatsData(userID uint) (*models.UserStorageStats, error) {
	var stats models.UserStorageStats
	stats.UserID = int(userID)

	var totalFiles int64
	if err := config.DB.Model(&models.FileReference{}).Where("user_id = ?", userID).Count(&totalFiles).Error; err != nil {
		return &stats, err
	}
	stats.TotalFiles = int(totalFiles)

	var totalSize int64
	result := config.DB.Table("file_references").
		Select("COALESCE(SUM(files.size), 0)").
		Joins("JOIN files ON file_references.file_id = files.id").
		Where("file_references.user_id = ?", userID).
		Scan(&totalSize)

	if result.Error != nil {
		return &stats, result.Error
	}
	stats.TotalStorageUsed = totalSize

	var duplicates int64
	if err := config.DB.Model(&models.FileReference{}).Where("user_id = ? AND is_duplicate = ?", userID, true).Count(&duplicates).Error; err != nil {
		return &stats, err
	}
	stats.TotalDuplicates = int(duplicates)

	var fileTypes []struct {
		MimeType string `json:"mime_type"`
		Count    int64  `json:"count"`
		Size     int64  `json:"size"`
	}

	result = config.DB.Table("file_references").
		Select("files.mime_type, COUNT(*) as count, SUM(files.size) as size").
		Joins("JOIN files ON file_references.file_id = files.id").
		Where("file_references.user_id = ?", userID).
		Group("files.mime_type").
		Scan(&fileTypes)

	if result.Error != nil {
		log.Printf("Warning: Failed to get file type stats: %v", result.Error)
	}

	stats.StorageByFileType = make(map[string]int64)
	for _, ft := range fileTypes {
		stats.StorageByFileType[ft.MimeType] = ft.Size
	}

	return &stats, nil
}

func GetUserStorageStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userClaims, ok := r.Context().Value(middlewares.UserContextKey).(*utils.Claims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "User information not found",
		})
		return
	}
	userID := int(userClaims.UserID)

	stats, err := utils.GetUserStorageStats(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to get storage stats: " + err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(stats)
}
