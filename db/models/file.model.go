package models

import (
	"os"
	"time"

	"gorm.io/gorm"
)

type File struct {
	ID             uint           `gorm:"primarykey" json:"id"`
	Hash           string         `gorm:"unique;not null;size:64;index" json:"hash"`
	OriginalName   string         `gorm:"not null;size:255" json:"original_name"`
	MimeType       string         `gorm:"not null;size:255;index" json:"mime_type"`
	Size           int64          `gorm:"not null" json:"size"`
	StoragePath    string         `gorm:"not null;size:500" json:"storage_path"`
	ReferenceCount int            `gorm:"default:1" json:"reference_count"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	FileReferences []FileReference `gorm:"foreignKey:FileID" json:"file_references,omitempty"`
}

func (File) TableName() string {
	return "files"
}

func (f *File) IncrementReferenceCount(tx *gorm.DB) error {
	return tx.Model(f).UpdateColumn("reference_count", gorm.Expr("reference_count + 1")).Error
}

func (f *File) DecrementReferenceCount(tx *gorm.DB) error {
	return tx.Model(f).UpdateColumn("reference_count", gorm.Expr("reference_count - 1")).Error
}

func (f *File) GetReferenceCount(tx *gorm.DB) (int, error) {
	var file File
	err := tx.Select("reference_count").Where("id = ?", f.ID).First(&file).Error
	return file.ReferenceCount, err
}

func (f *File) CanBeDeleted(tx *gorm.DB) (bool, error) {
	count, err := f.GetReferenceCount(tx)
	return count <= 0, err
}

type FileReference struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	UserID      uint           `gorm:"not null;index" json:"user_id"`
	FileID      uint           `gorm:"not null;index" json:"file_id"`
	DisplayName string         `gorm:"not null;size:255" json:"display_name"`
	IsDuplicate bool           `gorm:"default:false" json:"is_duplicate"`
	IsPrivate   bool           `gorm:"default:true" json:"is_private"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
	File File `gorm:"foreignKey:FileID" json:"file,omitempty"`
}

func (FileReference) TableName() string {
	return "file_references"
}

func (fr *FileReference) BeforeCreate(tx *gorm.DB) error {
	var file File
	if err := tx.First(&file, fr.FileID).Error; err != nil {
		return err
	}
	return file.IncrementReferenceCount(tx)
}

func (fr *FileReference) AfterDelete(tx *gorm.DB) error {
	var file File
	if err := tx.First(&file, fr.FileID).Error; err != nil {
		return err
	}

	if err := file.DecrementReferenceCount(tx); err != nil {
		return err
	}

	canDelete, err := file.CanBeDeleted(tx)
	if err != nil {
		return err
	}

	if canDelete {
		if file.StoragePath != "" {

			os.Remove(file.StoragePath)
		}

		return tx.Delete(&File{}, file.ID).Error
	}

	return nil
}

type UserStorageStats struct {
	UserID             int     `json:"user_id"`
	TotalFiles         int     `json:"total_files"`
	UniqueFiles        int     `json:"unique_files"`
	DuplicateFiles     int     `json:"duplicate_files"`
	TotalSizeBytes     int64   `json:"total_size_bytes"`
	ActualStorageBytes int64   `json:"actual_storage_bytes"`
	SavedBytes         int64   `json:"saved_bytes"`
	SavingsPercentage  float64 `json:"savings_percentage"`

	TotalStorageUsed  int64            `json:"total_storage_used"`
	TotalDuplicates   int              `json:"total_duplicates"`
	StorageByFileType map[string]int64 `json:"storage_by_file_type"`
}

type UploadResponse struct {
	Success      bool               `json:"success"`
	Message      string             `json:"message"`
	Files        []FileUploadResult `json:"files"`
	StorageStats UserStorageStats   `json:"storage_stats"`
}

type FileUploadResult struct {
	FileReference FileReference `json:"file_reference"`
	File          File          `json:"file"`
	WasDuplicate  bool          `json:"was_duplicate"`
	SavedBytes    int64         `json:"saved_bytes"`
}
