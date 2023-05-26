package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name  string

	Employee []Employee `gorm:"foreignKey:RoleID"`
	Admin	[]Admin  `gorm:"foreignKey:RoleID"`
	Users []User `gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	UserName string `gorm:"uniqueIndex"`
	Password string
	
	Email string
	Employee []Employee `gorm:"foreignKey:UserID"`

	Admin	[]Admin  `gorm:"foreignKey:UserID"`
	
	RoleID *uint
	Role   Role 

	DepartmentID *uint
	Department	Department
}
