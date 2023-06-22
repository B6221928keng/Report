package controller

import (
	"net/http"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

//-----------Part Signin -----------

// Get /users
// List All User
func ListUser(c *gin.Context) {
	var users []entity.UserAuthen
	if err := entity.DB().Raw("SELECT * FROM userauthen").Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   users,
	})
}

type userres struct {
	UserSerial  uint
	UserName    string
	UserLname   string
	DepName     string
	DepMail     string
	ManagerMail string
}

// Get /user/:id
// Get user
func GetUser(c *gin.Context) {
	var user userres
	id := c.Param("id")
	if err := entity.DB().Table("bt_userauthen").
		Select("bt_userauthen.user_serial, bt_userauthen.user_name, dt_user.user_lname, bt_department.dep_name, bt_department.dep_mail, bt_department.manager_mail").
		Joins("inner join dt_user on dt_user.user_serial = bt_userauthen.user_serial").
		Joins("inner join bt_department on bt_department.dep_id = bt_userauthen.dep_id").
		Where("bt_userauthen.user_serial = ?", id).
		Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   user,
	})
}

// func GetUser(c *gin.Context) {
// 	var user userres
// 	id := c.Param("id")
// 	if err := entity.DB().Table("userauthen").
// 		Select("userauthen.user_serial, userauthen.user_name, user.user_lname, department.dep_name, department.dep_mail, department.manager_mail").
// 		Joins("inner join user on user.user_serial = userauthen.user_serial").
// 		Joins("inner join department on department.dep_id = userauthen.dep_id").
// 		Where("userauthen.user_serial = ?", id).
// 		Find(&user).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"status": "OK",
// 		"data":   user,
// 	})
// }

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.UserAuthen
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if tx := entity.DB().Where("id = ?", user.UserSerial).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "Update Success",
		"data":   user,
	})
}

// DELETE /users/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM users WHETE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
