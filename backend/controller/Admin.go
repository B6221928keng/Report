package controller

import (
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

func ListAdmin(c *gin.Context) {
	var admins []entity.Admin
	if err := entity.DB().Preload("User").Preload("Admin").Raw("SELECT * FROM admins").Find(&admins).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": admins,
	})
}
func GetAdmin(c *gin.Context) {
	var admin entity.Admin
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM admins WHERE id = ?", id).Find(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": admin,
	})
}
func GetAdminByUserID(c *gin.Context) {
	var admin entity.Admin
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM admins WHERE user_id = ?", id).Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}