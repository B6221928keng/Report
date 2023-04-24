package controller

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
	// "gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)
    type FileUpload struct {
	gorm.Model
	Filename string
	Mimetype string
	Path     string
  }
  
  func GetFileUploadmain(c *gin.Context) {
	var fileUpload entity.FileUpload
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
	  panic("failed to connect database")
	}
	if err := c.ShouldBindJSON(&fileUpload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Migrate the schema
	db.AutoMigrate(&FileUpload{})
	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
	r := gin.Default()
  
	r.POST("/upload", func(c *gin.Context) {
	  // Handle file upload here
	  file, err := c.FormFile("file")
	  if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
		return
	  }
  
	  // Save file upload to database
	  fileUpload := FileUpload{Filename: file.Filename, Mimetype: file.Header.Get("Content-Type"), Path: file.Filename}
	  db.Create(&fileUpload)
  
	  // Save file to server
	  if err := c.SaveUploadedFile(file, "uploads/"+file.Filename); err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
		return
	  }
	  if err := c.ShouldBindJSON(&fileUpload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}  
	  c.String(http.StatusOK, fmt.Sprintf("File %s uploaded successfully", file.Filename))
	})
  
  }
  func GetFileUpload(c *gin.Context) {
	var fileUpload entity.FileUpload
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM fileUploads WHERE id = ?", id).Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if fileUpload.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fileUpload})
}
func ListFileUpload(c *gin.Context) {
	var fileUploads []entity.FileUpload
	if err := entity.DB().Raw("SELECT * FROM file_Uploads").Find(&fileUploads).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fileUploads})
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form data
	err := r.ParseMultipartForm(10 << 20) // 10 MB max file size
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Retrieve uploaded file
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file contents
	content, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create file on disk
	f, err := os.Create(fmt.Sprintf("./uploads/%s", file))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()

	// Write file contents to disk
	_, err = f.Write(content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("File uploaded successfully"))
}