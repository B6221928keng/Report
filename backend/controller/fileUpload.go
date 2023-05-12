package controller

import (
	"io"
	"net/http"
	// "os"
	// "path/filepath"
	// "strconv"
	// "time"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)
  
 

 // Method POST /upload
func UploadFile(c *gin.Context) {
	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get files from form
	files := form.File["files"]

	// Check if any files were uploaded
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploads found"})
		return
	}

	// Loop through files
	var fileUploads []entity.FileUpload
	for _, file := range files {
		// Open file
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer src.Close()

		// Read file content
		content, err := io.ReadAll(src)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Create file upload entity
		fileUpload := entity.FileUpload{
			Name:    file.Filename,
			Size:    file.Size,
			Type:    file.Header.Get("Content-Type"),
			Content: content,
		}
		fileUploads = append(fileUploads, fileUpload)
	}

	// Save file uploads to database
	if err := entity.DB().Create(&fileUploads).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUploads})
}

// Method GET /download/:id
func DownloadFile(c *gin.Context) {
	id := c.Param("id")

	var fileUpload entity.FileUpload
	if err := entity.DB().Where("id = ?", id).First(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Disposition", "attachment; filename="+fileUpload.Name)
	c.Header("Content-Type", fileUpload.Type)
	c.Data(http.StatusOK, fileUpload.Type, fileUpload.Content)
}
// GET /fileUploads
func ListFileUploads(c *gin.Context) {
	var fileUploads []entity.FileUpload
	if err := entity.DB().Find(&fileUploads).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fileUploads})
}

func ListFileUpload(c *gin.Context) {
	var fileUpload []entity.Department
	if err := entity.DB().Raw("SELECT * FROM file_uploads").Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
}