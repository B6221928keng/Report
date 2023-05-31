package controller

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

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

		// Save file to disk
		dst, err := os.Create(filepath.Join("./uploads", strconv.FormatInt(time.Now().UnixNano(), 10)+"_"+file.Filename))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer dst.Close()

		_, err = io.Copy(dst, src)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if len(fileUploads) == 0 {
		// No file uploads found, return error
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploads found"})
		return
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

	// Check if fileUpload is empty
	if fileUpload.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file upload not found"})
		return
	}

	c.Header("Content-Disposition", "attachment; filename="+fileUpload.Name)
	c.Header("Content-Type", fileUpload.Type)

	// Write the file content to the response body
	c.Writer.Write(fileUpload.Content)
}
// Method PATCH /upload/:id
func UpdateUploadFile(c *gin.Context) {
	id := c.Param("id")

	// Check if the file exists
	var fileUpload entity.FileUpload
	if err := entity.DB().Where("id = ?", id).First(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the file from form
	file := form.File["file"]
	if len(file) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file upload found"})
		return
	}

	// Open the file
	src, err := file[0].Open()
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

	// Update file upload entity
	fileUpload.Name = file[0].Filename
	fileUpload.Size = file[0].Size
	fileUpload.Type = file[0].Header.Get("Content-Type")
	fileUpload.Content = content

	// Save the updated file to disk
	dst, err := os.Create(filepath.Join("./uploads", strconv.FormatInt(time.Now().UnixNano(), 10)+"_"+file[0].Filename))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated file upload to database
	if err := entity.DB().Save(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
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
	var fileUpload []entity.FileUpload
	if err := entity.DB().Raw("SELECT * FROM file_uploads").Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
}

// GET /Department/:id
func GetFileUpload(c *gin.Context) {
	var fileUpload entity.FileUpload
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM file_uploads WHERE id = ?", id).Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if fileUpload.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
}

// DELETE /fileUploads/:id
func DeleteFileUpload(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM file_uploads WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file_uploads not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
