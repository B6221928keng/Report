package controller

import (
	"database/sql"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

type FileUp struct {
	FileUploadID    uint
	Name            string `json:"name"`
	Size            int64  `json:"size"`
	Type            string `json:"type"`
	Content         []byte `json:"-"`
	ReportProblemID uint   `json:"-"`
}

// POST /uploadFile
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "no fileupload found"})
		return
	}

	// Create a new database connection
	db, err := sql.Open("mysql", "root:@tcp(localhost:3306)/report?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer db.Close()

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

		// Create file upload entity
		fileUpload := entity.FileUpload{
			Name:         file.Filename,
			Size:         file.Size,
			Type:         file.Header.Get("Content-Type"),
			Content:      content,
			FileUploadID: 0, // เพิ่มค่าเริ่มต้นของ FileUploadID เป็น 0
		}

		fileUploads = append(fileUploads, fileUpload)
	}

	if len(fileUploads) == 0 {
		// No file uploads found, return error
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploads found"})
		return
	}

	// Prepare the statement for inserting file upload data
	stmt, err := db.Prepare("INSERT INTO fileUpload (name, size, type, content) VALUES (?, ?, ?, ?)")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer stmt.Close()

	// Insert file uploads
	for _, fileUpload := range fileUploads {
		// Check if file upload already exists by FileUploadID
		var existingFileUploadID uint
		err := db.QueryRow("SELECT file_upload_id FROM fileUpload WHERE file_upload_id = ?", fileUpload.FileUploadID).Scan(&existingFileUploadID)
		if err == nil {
			// File upload already exists, skip saving
			continue
		} else if err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Execute the prepared statement to insert file upload data
		result, err := stmt.Exec(fileUpload.Name, fileUpload.Size, fileUpload.Type, fileUpload.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Get the auto-incremented FileUploadID
		fileUploadID, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Update the FileUploadID of the current file upload
		fileUpload.FileUploadID = uint(fileUploadID)
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUploads})
}

// Method GET /download/:id
func DownloadFile(c *gin.Context) {
	id := c.Param("id")

	var fileUpload entity.FileUpload
	if err := entity.DB().Table("fileUpload").Where("file_upload_id = ?", id).First(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if fileUpload is empty
	if fileUpload.FileUploadID == 0 {
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
	if err := entity.DB().Preload("ReportProblem").
		Find(&fileUploads).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fileUploads})
}

// func ListFileUpload(c *gin.Context) {
// 	var fileUpload []entity.FileUpload
// 	if err := entity.DB().Raw("SELECT * FROM fileupload").Find(&fileUpload).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
// }

// GET /Department/:id
func GetFileUpload(c *gin.Context) {
	var fileUpload entity.FileUpload
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM fileupload WHERE id = ?", id).Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if fileUpload.FileUploadID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
}

// DELETE /fileUploads/:id
func DeleteFileUpload(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM fileuploads WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file_upload not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
