package entity

import (
	"time"
)
type ReportProblem struct {
	ID               uint       `gorm:"primaryKey;autoIncrement"`
	NotificationDate *time.Time `json:"notificationDate"`
	PendingDate      *time.Time `json:"pendingDate"`
	CompleteDate     *time.Time `json:"completeDate"`
	EndDate          *time.Time `json:"endDate"`

	Heading     string `validate:"required" json:"heading"`
	Description string `json:"description"`

	AdminID uint `json:"adminId"`

	UserSerial *uint      `gorm:"column:user_serial" json:"user_serial"`
	UserAuthen UserAuthen `gorm:"foreignKey:UserSerial" json:"user"`

	StID     *uint   `gorm:"column:StID" json:"StID"`
	Status   Status  `gorm:"foreignKey:StID" json:"status"`

	DepID      *uint       `gorm:"column:dep_id"`
	Department Department  `gorm:"foreignKey:DepID" json:"department"`

	FileUploadID *uint      `gorm:"column:file_upload_id" json:"file_upload_id"`
	FileUpload   FileUpload `gorm:"foreignKey:FileUploadID" json:"fileUpload"`
}

type ReportPr struct {
	ID               uint   `gorm:"primaryKey"`
	NotificationDate time.Time
	PendingDate      time.Time
	CompleteDate     time.Time
	EndDate          time.Time

	Heading     string `validate:"required"`
	Description string
	AdminID uint
	
	UserSerial *uint `gorm:"column:userserial" valid:"-"`
	UserName string
	UserLname string
	StID     *uint    `gorm:"column:st_id"`
	StatusName string
	DepID      *uint       `gorm:"column:dep_id"`
	DepName string
	FileUploadID *uint      `gorm:"column:file_upload_id"`
	Name         string     `json:"name"`
	Size         int64      `json:"size"`
	Type         string     `json:"type"`
	Content      []byte     `json:"content"`

}

type ReportProblem1 struct {
	ID               uint   `gorm:"primaryKey"`
	NotificationDate time.Time  `gorm:"column:notification_date"`
	PendingDate      time.Time   `gorm:"column:pending_date"`
	CompleteDate     time.Time  `gorm:"column:complete_date" `
	EndDate          time.Time  `gorm:"column:end_date"`

	Heading     string `validate:"required"`
	Description string

	AdminID uint
	// Admin   User `gorm:"foreignKey:AdminID" valid:"-"`

	UserSerial uint `gorm:"column:user_serial" valid:"-"`
	

	StID     uint    `gorm:"column:StID"`
	
	
	DepID      uint       `gorm:"column:dep_id"`
	
	
	FileUploadID *uint      `gorm:"column:file_upload_id" json:"fileUpload"`
	FileUpload   FileUpload `gorm:"foreignKey:FileUpload"`

}
type ReportProblem2 struct {
	ID               uint   `gorm:"primaryKey"`
	NotificationDate time.Time
	PendingDate      time.Time
	CompleteDate     time.Time
	EndDate          time.Time

	Heading     string `validate:"required"`
	Description string
	AdminID uint
	
	UserSerial *uint `gorm:"column:userserial" valid:"-"`
	UserName string
	UserLname string
	StID     *uint    `gorm:"column:st_id"`
	StatusName string
	DepID      *uint       `gorm:"column:dep_id"`
	DepName string
	FileUploadID *uint      `gorm:"column:file_upload_id"`
	Name         string     `json:"name"`
	Size         int64      `json:"size"`
	Type         string     `json:"type"`
	Content      []byte     `json:"content"`
}
type ReportProblem3 struct {
	ID               uint   `gorm:"primaryKey"`
	NotificationDate time.Time
	PendingDate      time.Time
	CompleteDate     time.Time
	EndDate          time.Time

	Heading     string `validate:"required"`
	Description string
	AdminID uint
	
	UserSerial *uint `gorm:"column:userserial" valid:"-"`
	UserName string
	UserLname string
	StID     *uint    `gorm:"column:st_id"`
	StatusName string
	DepID      *uint       `gorm:"column:dep_id"`
	DepName string
	FileUploadID *uint      `gorm:"column:file_upload_id"`
	Name         string     `json:"name"`
	Size         int64      `json:"size"`
	Type         string     `json:"type"`
	Content      []byte     `json:"content"`

}
type Status struct {
	StID           uint            `gorm:"primaryKey" db:"StID" json:"StID"`
	StatusName     string          `gorm:"uniqueIndex" db:"status_name"`
	ReportProblem  []ReportProblem `gorm:"foreignKey:StID"`
}


type FileUpload struct {
	FileUploadID uint       `gorm:"primaryKey;autoIncrement"  db:"file_upload_id" json:"file_upload_id"`
	Name         string     `json:"name"`
	Size         int64      `json:"size"`
	Type         string     `json:"type"`
	Content      []byte     `json:"content"`
	CreatedAt time.Time
	UpdatedAt time.Time
	ReportProblem []ReportProblem `gorm:"foreignKey:FileUploadID"` 
}

// type ReportProblem1 struct {
// 	ID               uint   `gorm:"primaryKey"`
// 	NotificationDate time.Time
// 	PendingDate      time.Time
// 	CompleteDate     time.Time
// 	EndDate          time.Time

// 	Heading     string `validate:"required"`
// 	Description string

// 	AdminID uint
// 	// Admin   User `gorm:"foreignKey:AdminID" valid:"-"`

// 	UserSerial *uint `gorm:"column:userserial" valid:"-"`
// 	User       User  `gorm:"foreignKey:UserSerial" valid:"-"`

// 	StID     *uint    `gorm:"column:st_id"`
// 	Status   Status   `gorm:"foreignKey:StID" valid:"-"`
	
// 	DepID      *uint       `gorm:"column:dep_id"`
// 	Department Department  `gorm:"foreignKey:DepID" valid:"-"`
	
// 	FileUploadID *uint      `gorm:"column:file_upload_id"`
// 	FileUpload   FileUpload `gorm:"foreignKey:FileUploadID" valid:"-"`

// }