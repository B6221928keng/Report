package entity

import (

	_ "image/png"
	"time"

	"gorm.io/gorm"
)

type ReportProblem struct {
	gorm.Model
	NotificationDate time.Time
	Heading          string
	Description      string

	EmployeeID *uint
	Employee   Employee

	StatusID *uint
	Status   Status `gorm:"references:id" valid:"-"`

	DepartmentID *uint
	Department   Department `gorm:"references:id" valid:"-"`

	FileUploadID *uint
	FileUpload   FileUpload `gorm:"references:id" valid:"-"`
}
type Status struct {
	gorm.Model

	StatusName string `gorm:"uniqueIndex"`

	reportProblem []ReportProblem `gorm:"foreignKey:StatusID"`
}

type Department struct {
	gorm.Model

	DepartmentName string `gorm:"uniqueIndex"`

	reportProblem []ReportProblem `gorm:"foreignKey:DepartmentID"`
}

type Employee struct {
	gorm.Model

	EmployeeName string `gorm:"uniqueIndex"`
	Email        string

	UserID *uint
	User   User

	RoleID *uint
	Role   Role

	DepartmentID *uint
	Department   Department

	reportProblem []ReportProblem `gorm:"foreignKey:EmployeeID"`
}
type FileUpload struct {
	gorm.Model
	Filename string
	Mimetype string
	Path     string

	reportProblem []ReportProblem `gorm:"foreignKey:FileUploadID"`
  }