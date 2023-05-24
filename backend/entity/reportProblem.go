package entity

import (
	
	"time"
	"gorm.io/gorm"
)

type ReportProblem struct {
	gorm.Model
	ID uint
	NotificationDate time.Time
	Heading          string   `validate:"required"`
	Description      string   
	EmployeeID *uint
	Employee   Employee
	
	StatusID *uint
	Status   Status `gorm:"references:id" valid:"-"`

	DepartmentID *uint
	Department   Department `gorm:"references:id" valid:"-"`
	
	FileUploadID   *uint `gorm:"column:file_upload_id"` // ตั้งค่าชื่อคอลัมน์เป็น file_upload_id
	FileUpload     FileUpload `gorm:"foreignKey:FileUploadID" valid:"-"`
}
type ReportProblem1 struct {
	gorm.Model
	ID int
	NotificationDate time.Time
	Heading          string
	Description      string

	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`

	StatusID *uint
	Status   Status `gorm:"references:id" valid:"-"`

	DepartmentID *uint
	Department   Department `gorm:"references:id" valid:"-"`
	FileUploadID   *uint `gorm:"column:file_upload_id"` // ตั้งค่าชื่อคอลัมน์เป็น file_upload_id
	FileUpload     FileUpload `gorm:"foreignKey:FileUploadID" valid:"-"`

}
type ReportProblem2 struct {
	gorm.Model
	ID int
	NotificationDate time.Time
	Heading          string
	Description      string

	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`

	StatusID *uint
	Status   Status `gorm:"references:id" valid:"-"`

	DepartmentID *uint
	Department   Department `gorm:"references:id" valid:"-"`

	FileUploadID   *uint `gorm:"column:file_upload_id"` // ตั้งค่าชื่อคอลัมน์เป็น file_upload_id
	FileUpload     FileUpload `gorm:"foreignKey:FileUploadID" valid:"-"`
}
type ReportProblem3 struct {
	gorm.Model
	ID int
	NotificationDate time.Time
	Heading          string `valid:"required"`
	Description      string

	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`

	StatusID *uint
	Status   Status `gorm:"references:id" valid:"-"`

	DepartmentID *uint
	Department   Department `gorm:"references:id" valid:"-"`

	FileUploadID   *uint `gorm:"column:file_upload_id"` // ตั้งค่าชื่อคอลัมน์เป็น file_upload_id
	FileUpload     FileUpload `gorm:"foreignKey:FileUploadID" valid:"-"`

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
	Name    string `json:"name"`
	Size    int64  `json:"size"`
	Type    string `json:"type"`
	Content []byte `json:"content"`
	CreatedAt time.Time
	UpdatedAt time.Time
	reportProblem []ReportProblem `gorm:"foreignKey:FileUploadID"`
  }

//   func (rp *ReportProblem) BeforeCreate(tx *gorm.DB) (err error) {
// 	// Get current date in UTC
// 	now := time.Now().UTC()
// 	// Get start of day in UTC
// 	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC).UTC()
// 	// Get end of day in UTC
// 	endOfDay := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 999999999, time.UTC).UTC()

// 	// Count the number of ReportProblems with IDs created between start and end of day
// 	var count int64
// 	if err := tx.Model(&ReportProblem{}).Where("created_at BETWEEN ? AND ?", startOfDay, endOfDay).Count(&count).Error; err != nil {
// 		return err
// 	}

// 	// Set ID to count + 1
// 	rp.ID = uint(count + 1)
// 	return nil
// }

// // Validate validates the fields of the ReportProblem struct
// func (rp *ReportProblem) Validate() error {
// 	_, err := govalidator.ValidateStruct(rp)
// 	return err
// }

