package controllers

import (
	"encoding/json"
	"net/http"

	"volt/db/config"
	"volt/db/models"

	"volt/auth-service/pkg/middlewares"
	"volt/auth-service/pkg/utils"

	"gorm.io/gorm"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "healthy",
		"service":  "auth-service",
		"database": "connected",
	})
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var userReq models.UserRequest
	if err := json.NewDecoder(r.Body).Decode(&userReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid request body",
		})
		return
	}

	user := models.User{
		Username: userReq.Username,
		Email:    userReq.Email,
		Password: userReq.Password,
	}

	if err := user.ValidateUser(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": err.Error(),
		})
		return
	}

	var existingUser models.User
	if err := config.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "User with this email already exists",
		})
		return
	}

	if err := config.DB.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "User with this username already exists",
		})
		return
	}

	if err := config.DB.Create(&user).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Failed to create user",
		})
		return
	}

	token, err := utils.GenerateJWT(user.ID, user.Username, user.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Failed to generate token",
		})
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  user.ToResponse(),
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginReq models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid request body",
		})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", loginReq.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"message": "Invalid credentials",
			})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Database error",
		})
		return
	}

	if err := user.CheckPassword(loginReq.Password); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid credentials",
		})
		return
	}

	token, err := utils.GenerateJWT(user.ID, user.Username, user.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Failed to generate token",
		})
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  user.ToResponse(),
	}

	json.NewEncoder(w).Encode(response)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	claims := middlewares.GetUserFromContext(r)
	if claims == nil {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	var user models.User
	if err := config.DB.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user.ToResponse())
}

func RefreshToken(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	claims := middlewares.GetUserFromContext(r)
	if claims == nil {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateJWT(claims.UserID, claims.Username, claims.Email)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": "Bearer " + token,
	})
}
