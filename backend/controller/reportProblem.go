package controller

import (
	// "fmt"
	// "io"

	"github.com/B6221928keng/Report/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"

	"net/http"
	"time"
)

// POST /reportProblems
func CreateReportProblem(c *gin.Context) {
	var reportproblem entity.ReportProblem1
	// var user entity.UserAuthen
	// var status entity.Status
	// var department entity.Department
	var fileUpload entity.FileUpload
	// var admin entity.Admin

	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&reportproblem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if err := entity.DB().Table("userauthen").Find(&user, "user_serial = ?", reportproblem.UserSerial).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error user": err.Error()})
	// 	return
	// }

	// if err := entity.DB().Table("department").Find(&department, "dep_id = ?", reportproblem.DepID).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error department": err.Error()})
	// 	return
	// }

	// if err := entity.DB().Table("status").Find(&status, "StID = ?", reportproblem.StID).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error status": err.Error()})
	// 	return
	// }

	if err := entity.DB().Table("bt_fileupload").Select("*").Where("file_upload_id=?", reportproblem.FileUploadID).Find(&fileUpload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error bt_fileupload": err.Error()})
		return
	}
	// Check if file is uploaded
	// file, err := c.FormFile("file")
	// if err == nil {
	// 	// Open file
	// 	src, err := file.Open()
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	defer src.Close()

	// 	// Read file content
	// 	content, err := ioutil.ReadAll(src)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return

	// 	}

	// 	// Create file upload entity
	// 	fileUpload := entity.FileUpload{
	// 		Name:    file.Filename,
	// 		Size:    file.Size,
	// 		Type:    file.Header.Get("Content-Type"),
	// 		Content: content,
	// 	}

	// 	// Save file uploads to database
	// 	if err := entity.DB().Table("fileupload").Create(&fileUpload).Error; err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	reportproblem.FileUploadID = &fileUpload.FileUploadID
	// }
	// // Check if file upload ID is provided
	// if reportproblem.FileUploadID != nil {
	// 	// Retrieve file upload from database
	// 	if tx := entity.DB().Table("fileupload").Where("file_upload_id = ?", *reportproblem.FileUploadID).First(&fileUpload); tx.RowsAffected == 0 {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "fileupload not found"})
	// 		return
	// 	}
	// 	reportproblem.FileUpload = fileUpload
	// } else {
	// 	// No file uploaded, set FileUpload field to empty struct
	// 	reportproblem.FileUpload = entity.FileUpload{}
	// 	reportproblem.FileUploadID = nil
	// }

	// // Set file upload ID if file is uploaded
	// if reportproblem.FileUploadID == nil && reportproblem.FileUpload.FileUploadID != 0 {
	// 	reportproblem.FileUploadID = &reportproblem.FileUpload.FileUploadID
	// }

	// Create ReportProblem entity
	wv := entity.ReportProblem1{
		PendingDate:      reportproblem.PendingDate,
		CompleteDate:     reportproblem.CompleteDate,
		EndDate:          reportproblem.EndDate,
		NotificationDate: reportproblem.NotificationDate,
		Heading:          reportproblem.Heading,
		Description:      reportproblem.Description,
		UserSerial:       reportproblem.UserSerial,
		StID:             reportproblem.StID,
		DepID:            reportproblem.DepID,
		FileUploadID:     &fileUpload.FileUploadID,
	}

	// Validate entity
	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Save entity to database
	if err := entity.DB().Table("bt_reportproblem").Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

type Report struct {
	ID               uint `gorm:"primaryKey"`
	NotificationDate time.Time
	PendingDate      time.Time //ค่าเวลาตรวจงาน
	CompleteDate     time.Time //ค่าเวลาทำงาน
	EndDate          time.Time //ค่าเวลาเสร็จงาน

	Heading     string `validate:"required"`
	Description string
	AdminID     uint

	UserSerial *uint `gorm:"column:user_serial" valid:"-"`
	UserName   string
	UserLname  string

	StID       *uint `gorm:"column:st_id"`
	StatusName string
	DepID      *uint `gorm:"column:dep_id"`
	DepName    string

	FileUploadID *uint  `gorm:"column:file_upload_id"` // ตั้งค่าชื่อคอลัมน์เป็น file_upload_id
	Name         string `json:"name"`
	Size         int64  `json:"size"`
	Type         string `json:"type"`
	Content      []byte `json:"content"`
}

// Get /reportProblem/:id
func GetReportProblem2(c *gin.Context) {
	var report entity.ReportProblem
	id := c.Param("id")
	if err := entity.DB().Table("reportproblem").
		Select("reportproblem.id, reportproblem.heading, reportproblem.description, reportproblem.notification_date, reportproblem.pending_date, reportproblem.complete_date, reportproblem.end_date, reportproblem.user_serial, reportproblem.admin_id, reportproblem.StID, reportproblem.dep_id, reportproblem.file_upload_id").
		Joins("inner join userauthen on userauthen.user_serial = reportproblem.user_serial").
		Joins("inner join status on status.StID = reportproblem.StID").
		Joins("inner join department on department.dep_id = reportproblem.dep_id").
		Joins("inner join fileupload on fileupload.file_upload_id = reportproblem.file_upload_id").
		Where("reportproblem.id = ?", id).
		First(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   report,
	})
}
func GetReportProblem(c *gin.Context) {
	var report entity.ReportProblem
	id := c.Param("id")
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("inner join dt_user on dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("inner join bt_status on bt_status.StID = bt_reportproblem.StID").
		Joins("inner join bt_department on bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("inner join bt_fileupload on bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Raw("SELECT * FROM bt_reportproblem WHERE id = ?", id).
		Scan(&report).
		First(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": report})
}
func GetReportProblem3(c *gin.Context) {
	var report entity.ReportProblem
	id := c.Param("id")
	if err := entity.DB().Table("reportproblem").Raw("SELECT * FROM reportproblem WHERE id = ?", id).Scan(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": report})
}

// GET /reportProblem/:id
//
//	func GetReportProblem(c *gin.Context) {
//		var reportProblem entity.ReportProblem
//		id := c.Param("id")
//		if err := entity.DB().Preload("user").Preload("userauthen").Preload("status").Preload("department").Preload("fileupload").Raw("SELECT * FROM reportproblem WHERE id = ?", id).Find(&reportProblem).Error; err != nil {
//			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//			return
//		}
//		c.JSON(http.StatusOK, gin.H{"data": reportProblem})
//	}
//
// GET /reportProblem/:id
func GetReportProblem1(c *gin.Context) {
	var reportproblem entity.ReportProblem
	id := c.Param("id")
	if err := entity.DB().Table("reportproblem").Raw("SELECT * FROM reportproblem WHERE id = ?", id).Find(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if reportproblem.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reportproblem})
}

func ListReportProblemHome(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("JOIN dt_user ON dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("JOIN bt_status ON bt_status.StID = bt_reportproblem.StID").
		Joins("JOIN bt_department ON bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("JOIN bt_fileupload ON bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}
func ListReportProblem(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("JOIN dt_user ON dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("JOIN bt_status ON bt_status.StID = bt_reportproblem.StID").
		Joins("JOIN bt_department ON bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("JOIN bt_fileupload ON bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}
// func ListReportProblem(c *gin.Context) {
// 	var reportProblems []entity.ReportPr
// 	if err := entity.DB().Table("bt_reportproblem").
// 		Select("bt_reportproblem.*, user.*, status.*, department.*, fileupload.*").
// 		Joins("JOIN user ON user.user_serial = bt_reportproblem.user_serial").
// 		Joins("JOIN status ON status.StID = bt_reportproblem.StID").
// 		Joins("JOIN department ON department.dep_id = bt_reportproblem.dep_id").
// 		Joins("JOIN fileupload ON fileupload.file_upload_id = bt_reportproblem.file_upload_id").
// 		Find(&reportProblems).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
// }

func ListReportProblemStatusID1(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("inner join dt_user on dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("inner join bt_status on bt_status.StID = bt_reportproblem.StID").
		Joins("inner join bt_department on bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("inner join bt_fileupload on bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Where("bt_status.StID = 1").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}

func ListReportProblemStatusID2(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("inner join dt_user on dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("inner join bt_status on bt_status.StID = bt_reportproblem.StID").
		Joins("inner join bt_department on bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("inner join bt_fileupload on bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Where("bt_status.StID = 2").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}
func ListReportProblemStatusID3(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("inner join dt_user on dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("inner join bt_status on bt_status.StID = bt_reportproblem.StID").
		Joins("inner join bt_department on bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("inner join bt_fileupload on bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Where("bt_status.StID = 3").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}
func ListReportProblemStatusID4(c *gin.Context) {
	var reportProblems []entity.ReportPr
	if err := entity.DB().Table("bt_reportproblem").
		Select("bt_reportproblem.*, dt_user.*, bt_status.*, bt_department.*, bt_fileupload.*").
		Joins("inner join dt_user on dt_user.user_serial = bt_reportproblem.user_serial").
		Joins("inner join bt_status on bt_status.StID = bt_reportproblem.StID").
		Joins("inner join bt_department on bt_department.dep_id = bt_reportproblem.dep_id").
		Joins("inner join bt_fileupload on bt_fileupload.file_upload_id = bt_reportproblem.file_upload_id").
		Where("bt_status.StID = 4").
		Find(&reportProblems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblems})
}

// DELETE /reportProblems/:id
func DeleteReportProblem(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM bt_reportproblem WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bt_reportproblem not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

type output struct {
	ID          int
	id          int
	NotiDate    time.Time
	Heading     string
	Description string
	Empname     string
	Status      string
	Department  string
	// FileUpload   string
}

func ListAdminReportProblem(c *gin.Context) {
	var output []output
	StaID := c.Param("id")
	if err := entity.DB().Table("report_problems").
		Select("report_problems.id, departments.id, statuse.id, employees.emp_name, statuses.name, departments.name, report_problems.heading, report_problems.description, report_problems.notification_date").
		Joins("INNER JOIN report_problems ON report_problems.id = report_problems.report_type_id").
		Joins("INNER JOIN employees ON employees.id = report_problems.employee_id").
		Joins("INNER JOIN departments ON departments.id = report_problems.department_id").
		Joins("INNER JOIN statuses ON statuses.id = report_problems.status_id").
		Where("status_id = ?", StaID).
		Find(&output).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func UpdateReportProblemP(c *gin.Context) {
	var reportproblem entity.ReportProblem1
	var newreport entity.ReportProblem1

	if err := c.ShouldBindJSON(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if tx := entity.DB().Table("bt_reportproblem").Where("id = ?", newreport.ID).First(&reportproblem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bt_reportproblem not found"})
		return
	}

	// ค้นหา ltype ด้วย id

	reportproblem.StID = newreport.StID
	reportproblem.AdminID = newreport.AdminID
	reportproblem.CompleteDate = newreport.CompleteDate
	reportproblem.PendingDate = newreport.PendingDate
	reportproblem.EndDate = newreport.EndDate

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_reportproblem").Save(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reportproblem})
}
func UpdateReportProblemC(c *gin.Context) {
	var reportproblem entity.ReportProblem1
	var newreport entity.ReportProblem1

	if err := c.ShouldBindJSON(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if tx := entity.DB().Table("bt_reportproblem").Where("id = ?", newreport.ID).First(&reportproblem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Leave not found"})
		return
	}

	// ค้นหา ltype ด้วย id

	reportproblem.StID = newreport.StID
	reportproblem.AdminID = newreport.AdminID
	reportproblem.CompleteDate = newreport.CompleteDate
	reportproblem.EndDate = newreport.EndDate

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_reportproblem").Save(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reportproblem})
}
func UpdateReportProblemE(c *gin.Context) {
	var reportproblem entity.ReportProblem1
	var newreport entity.ReportProblem1

	if err := c.ShouldBindJSON(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if tx := entity.DB().Table("bt_reportproblem").Where("id = ?", newreport.ID).First(&reportproblem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Leave not found"})
		return
	}
	reportproblem.StID = newreport.StID
	reportproblem.AdminID = newreport.AdminID
	reportproblem.EndDate = newreport.EndDate

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_reportproblem").Save(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reportproblem})
}
func UpdateReportProblemUser(c *gin.Context) {
	var reportproblem entity.ReportProblem
	var newreport entity.ReportProblem
	var fileUpload entity.FileUpload

	if err := c.ShouldBindJSON(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newreport); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Table("bt_reportproblem").Where("id = ?", newreport.ID).First(&reportproblem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bt_reportproblem not found"})
		return
	}
	reportproblem.NotificationDate = newreport.NotificationDate
	reportproblem.Heading = newreport.Heading
	reportproblem.Description = newreport.Description

	// ดึงข้อมูล FileUpload ล่าสุดจากฐานข้อมูล
	if tx := entity.DB().Table("bt_fileupload").Order("file_upload_id desc").First(&fileUpload); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bt_fileupload not found"})
		return
	}
	reportproblem.FileUploadID = &fileUpload.FileUploadID

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_reportproblem").Save(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the report problem in the database
	if err := entity.DB().Table("bt_reportproblem").Where("id = ?", reportproblem.ID).Updates(&reportproblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reportproblem})
}

