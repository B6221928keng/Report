package controller

import (
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

// POST /Status
func CreateStatus(c *gin.Context) {
	var status entity.Status

	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": status})
}

// List /Statuss
func ListStatus(c *gin.Context) {
	var statuss []entity.Status
	if err := entity.DB().Table("status").Raw("SELECT * FROM status").Find(&statuss).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": statuss})
}

// GET /status/:id
func GetStatus(c *gin.Context) {
	var status entity.Status
	id := c.Param("id")
	if err := entity.DB().Table("status").Raw("SELECT * FROM status WHERE StID = ?", id).Find(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if status.StID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "StID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": status})
}
