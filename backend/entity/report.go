package entity

import (
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

	reportProblem []ReportProblem `gorm:"foreignKey:EmployeeID"`
}
