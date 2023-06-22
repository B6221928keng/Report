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
	if err := entity.DB().Raw("SELECT * FROM bt_department").Find(&departments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": departments})
}


// GET /Department/:id
func GetDepartment(c *gin.Context) {
	var department entity.Department
	id := c.Param("id")
	if err := entity.DB().Table("department").Find(&department, "dep_id = ?", id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error department": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": department})
}


func GetDepartmentByUserID(c *gin.Context) {
	var department entity.Department
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("UserPermission").Raw("SELECT * FROM departments WHERE user_id = ?", id).Scan(&department).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": department})
}