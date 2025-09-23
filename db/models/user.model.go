	package models

	import (
		"fmt"
		"regexp"
		"time"

		"golang.org/x/crypto/bcrypt"
		"gorm.io/gorm"
	)

	type User struct {
		ID        uint           `gorm:"primarykey" json:"id"`
		Username  string         `gorm:"unique;not null;size:255" json:"username" validate:"required,min=3,max=50"`
		Email     string         `gorm:"unique;not null;size:255" json:"email" validate:"required,email"`
		Password  string         `gorm:"not null" json:"-"`
		CreatedAt time.Time      `json:"created_at"`
		UpdatedAt time.Time      `json:"updated_at"`
		DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

		FileReferences []FileReference `gorm:"foreignKey:UserID" json:"file_references,omitempty"`
	}

	type UserRequest struct {
		Username string `json:"username" validate:"required,min=3,max=50"`
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
	}

	type UserResponse struct {
		ID        uint      `json:"id"`
		Username  string    `json:"username"`
		Email     string    `json:"email"`
		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
	}

	type LoginRequest struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	type AuthResponse struct {
		Token string       `json:"token"`
		User  UserResponse `json:"user"`
	}

	func (User) TableName() string {
		return "users"
	}

	func (u *User) BeforeCreate(tx *gorm.DB) error {
		if u.Password != "" {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			u.Password = string(hashedPassword)
		}
		return nil
	}

	func (u *User) CheckPassword(password string) error {
		return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	}

	func (u *User) ToResponse() UserResponse {
		return UserResponse{
			ID:        u.ID,
			Username:  u.Username,
			Email:     u.Email,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		}
	}

	func (u *User) ValidateUser() error {
		re := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`) // email regex

		switch {
		case u.Username == "":
			return fmt.Errorf("username is required")
		case len(u.Username) < 3:
			return fmt.Errorf("username must be at least 3 characters long")
		case len(u.Username) > 50:
			return fmt.Errorf("username must be less than 50 characters")
		case u.Email == "":
			return fmt.Errorf("email is required")
		case !re.MatchString(u.Email):
			return fmt.Errorf("invalid email format")
		case u.Password == "":
			return fmt.Errorf("password is required")
		case len(u.Password) < 6:
			return fmt.Errorf("password must be at least 6 characters long")
		}
		return nil
	}

	func (u *User) GetFileCount(tx *gorm.DB) (int64, error) {
		var count int64
		err := tx.Model(&FileReference{}).Where("user_id = ?", u.ID).Count(&count).Error
		return count, err
	}

	func (u *User) GetTotalStorageUsed(tx *gorm.DB) (int64, error) {
		var totalSize int64
		err := tx.Table("file_references").
			Select("SUM(files.size)").
			Joins("JOIN files ON files.id = file_references.file_id").
			Where("file_references.user_id = ?", u.ID).
			Scan(&totalSize).Error
		return totalSize, err
	}
