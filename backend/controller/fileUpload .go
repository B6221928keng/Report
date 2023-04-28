package controller

import (
	"net/http"
	"path"
	"io"
	"os"
	"time"
	"github.com/gin-gonic/gin"
  )
  
  type Report struct {
	ID    int      `json:"id"`
	Name  string   `json:"name"`
	Date  string   `json:"date"`
	Files []string `json:"files"`
  }
  
  var reports []Report
  
  func uploadFiles(c *gin.Context) {
	files := c.Request.MultipartForm.File["files"]
  
	var fileNames []string
	for _, file := range files {
	  fileName := path.Base(file.Filename)
	  if err := c.SaveUploadedFile(file, "uploads/"+fileName); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload files"})
		return
	  }
	  fileNames = append(fileNames, fileName)
	}
  
	report := Report{
	  ID:    len(reports) + 1,
	  Name:  c.PostForm("name"),
	  Date:  time.Now().String(),
	  Files: fileNames,
	}
  
	reports = append(reports, report)
  
	c.JSON(http.StatusCreated, gin.H{"report": report})
  }
  
  func getReports(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"reports": reports})
  }
  
  func downloadFile(c *gin.Context) {
	fileName := c.Param("fileName")
	file, err := os.Open("uploads/" + fileName)
	if err != nil {
	  c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to download file"})
	  return
	}
	defer file.Close()
  
	c.Writer.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	c.Writer.Header().Set("Content-Type", "application/octet-stream")
	io.Copy(c.Writer, file)
  }
  