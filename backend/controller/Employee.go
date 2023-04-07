package controller

import (
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

func ListEmployee(c *gin.Context) {
	var employees []entity.Employee
	if err := entity.DB().Preload("User").Preload("Employee").Raw("SELECT * FROM employees").Find(&employees).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": employees,
	})
}
func GetEmployee(c *gin.Context) {
	var employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM employees WHERE id = ?", id).Find(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": employee,
	})
}
func GetEmployeeByUserID(c *gin.Context) {
	var employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM employees WHERE user_id = ?", id).Scan(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee})
}