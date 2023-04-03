package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name  string
	Users []User `gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	UserName string `gorm:"uniqueIndex"`
	Password string

	RoleID *uint
	Role   Role `gorm:"foreignKey:RoleID"`
}
