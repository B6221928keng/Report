package controller

import (
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

// POST /Department
func CreateDepartment(c *gin.Context) {
	var department entity.Department

	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&department).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": department})
}

// List /Departments
func ListDepartment(c *gin.Context) {
	var departments []entity.Department
	if err := entity.DB().Raw("SELECT * FROM departments").Find(&departments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": departments})
}

// GET /Department/:id
func GetDepartment(c *gin.Context) {
	var department entity.Department
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM departments WHERE id = ?", id).Find(&department).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if department.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": department})
}
