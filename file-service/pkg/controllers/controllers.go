package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

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
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	userIDStr := r.FormValue("user_id")
	userID := uint(1)
	if userIDStr != "" {
		if parsedID, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			userID = uint(parsedID)
		}
	}

	isPrivate := true
	if privacyStr := r.FormValue("is_private"); privacyStr == "false" {
		isPrivate = false
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to get file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	result, err := utils.ProcessFileUpload(file, header, userID, isPrivate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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

	json.NewEncoder(w).Encode(response)
}

func GetFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIDStr := r.URL.Query().Get("user_id")
	userID := uint(1)
	if userIDStr != "" {
		if parsedID, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			userID = uint(parsedID)
		}
	}

	var fileRefs []models.FileReference
	result := config.DB.Where("user_id = ?", userID).
		Preload("File").
		Preload("User").
		Order("created_at DESC").
		Find(&fileRefs)

	if result.Error != nil {
		http.Error(w, "Failed to get files: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	var files []map[string]interface{}
	for _, ref := range fileRefs {
		fileData := map[string]interface{}{
			"id":           ref.ID,
			"user_id":      ref.UserID,
			"file_id":      ref.FileID,
			"display_name": ref.DisplayName,
			"is_duplicate": ref.IsDuplicate,
			"is_private":   ref.IsPrivate,
			"created_at":   ref.CreatedAt,
			"updated_at":   ref.UpdatedAt,
			"file": map[string]interface{}{
				"id":              ref.File.ID,
				"hash":            ref.File.Hash,
				"original_name":   ref.File.OriginalName,
				"mime_type":       ref.File.MimeType,
				"size":            ref.File.Size,
				"storage_path":    ref.File.StoragePath,
				"reference_count": ref.File.ReferenceCount,
				"created_at":      ref.File.CreatedAt,
			},
		}
		files = append(files, fileData)
	}

	json.NewEncoder(w).Encode(files)
}

func GetFileByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	fileRefID, err := strconv.ParseUint(vars["ID"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid file reference ID", http.StatusBadRequest)
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	userID := uint(1)
	if userIDStr != "" {
		if parsedID, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			userID = uint(parsedID)
		}
	}

	var fileRef models.FileReference
	result := config.DB.Where("id = ? AND user_id = ?", uint(fileRefID), userID).
		Preload("File").
		Preload("User").
		First(&fileRef)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Database error: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	fileData := map[string]interface{}{
		"id":           fileRef.ID,
		"user_id":      fileRef.UserID,
		"file_id":      fileRef.FileID,
		"display_name": fileRef.DisplayName,
		"is_duplicate": fileRef.IsDuplicate,
		"is_private":   fileRef.IsPrivate,
		"created_at":   fileRef.CreatedAt,
		"updated_at":   fileRef.UpdatedAt,
		"file": map[string]interface{}{
			"id":              fileRef.File.ID,
			"hash":            fileRef.File.Hash,
			"original_name":   fileRef.File.OriginalName,
			"mime_type":       fileRef.File.MimeType,
			"size":            fileRef.File.Size,
			"storage_path":    fileRef.File.StoragePath,
			"reference_count": fileRef.File.ReferenceCount,
			"created_at":      fileRef.File.CreatedAt,
		},
	}

	json.NewEncoder(w).Encode(fileData)
}

func DeleteFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	fileRefID, err := strconv.ParseUint(vars["ID"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid file reference ID", http.StatusBadRequest)
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	userID := uint(1)
	if userIDStr != "" {
		if parsedID, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			userID = uint(parsedID)
		}
	}

	// First check if the file reference exists and belongs to the user
	var fileRef models.FileReference
	result := config.DB.Where("id = ? AND user_id = ?", uint(fileRefID), userID).First(&fileRef)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Database error: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// Delete the file reference (soft delete with GORM)
	if err := config.DB.Delete(&fileRef).Error; err != nil {
		http.Error(w, "Failed to delete file: "+err.Error(), http.StatusInternalServerError)
		return
	}

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

// GetUserStorageStats HTTP handler for getting user storage statistics
func GetUserStorageStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIDStr := r.URL.Query().Get("user_id")
	userID := 1
	if userIDStr != "" {
		if parsedID, err := strconv.Atoi(userIDStr); err == nil {
			userID = parsedID
		}
	}

	stats, err := utils.GetUserStorageStats(userID)
	if err != nil {
		http.Error(w, "Failed to get storage stats: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(stats)
}
