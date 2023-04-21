package controller

import (
	"fmt"
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
	"time"
)

// POST /File
func CreateFile(c *gin.Context) {
	var file entity.File

	if err := c.ShouldBindJSON(&file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&file).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": file})
}

// List /Files
func ListFile(c *gin.Context) {
	var files []entity.File
	if err := entity.DB().Raw("SELECT * FROM files").Find(&files).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": files})
}

// GET /File/:id
func GetFile(c *gin.Context) {
	var file entity.File
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM files WHERE id = ?", id).Find(&file).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if file.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": file})
}
func GetFileByUserID(c *gin.Context) {
	var file entity.File
	id := c.Param("id")
	if err := entity.DB().Preload("file").Raw("SELECT * FROM files WHERE user_id = ?", id).Scan(&file).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": file})
}
func Getmain() {
	mux := http.NewServeMux()
	mux.HandleFunc("/upload", GethandleUpload)
	mux.HandleFunc("/delete", GethandleDelete)

	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", mux)
}

func GethandleUpload(w http.ResponseWriter, r *http.Request) {
	// use modules such as github.com/h2non/filetype, github.com/go-playground/validator, etc.
	time.Sleep(3 * time.Second)
	fmt.Println("file uploaded")
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"result": true, "msg": "file uploaded"}`)
}

func GethandleDelete(w http.ResponseWriter, r *http.Request) {
	fmt.Println("file deleted")
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"result": true, "msg": "file deleted"}`)
}