package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/B6221928keng/Report/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /reportProblems
func CreateReportProblem(c *gin.Context) {
	var reportProblem entity.ReportProblem
	var Employee entity.Employee
	var status entity.Status
	var department entity.Department
	//  var fileUpload entity.FileUpload

	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&reportProblem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา department ด้วย id แผนก
	if tx := entity.DB().Where("id = ?", reportProblem.DepartmentID).First(&department); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}

	// 10: ค้นหา status ด้วย id สถานะ
	if tx := entity.DB().Where("id = ?", reportProblem.StatusID).First(&status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status not found"})
		return
	}

	//  11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", reportProblem.EmployeeID).First(&Employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	//  : ค้นหา file ด้วย id
	// if tx := entity.DB().Where("id = ?", reportProblem.FileUploadID).First(&fileUpload); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "fileUpload not found"})
	// 	return
	// }
	// 12: สร้าง ReportProblem
	wv := entity.ReportProblem{
		NotificationDate: reportProblem.NotificationDate,
		Heading:          reportProblem.Heading,
		Description:      reportProblem.Description,
		Employee:         reportProblem.Employee,
		Status:           status,
		Department:       department,
		FileUpload:       reportProblem.FileUpload,
	}
	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 15: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

// GET /reportProblem/:id
func GetReportProblem(c *gin.Context) {
	var reportProblem entity.ReportProblem
	id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Raw("SELECT * FROM report_Problems WHERE id = ?", id).Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}

// GET /reportProblem
func ListReportProblem(c *gin.Context) {
	var reportProblem []entity.ReportProblem
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Preload("FileUpload").Raw("SELECT * FROM report_Problems").Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}

func ListReportProblemStatusID1(c *gin.Context) {
	var reportProblem []entity.ReportProblem
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Preload("FileUpload").Raw("SELECT * FROM report_Problems where status_id = 1").Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}
func ListReportProblemStatusID2(c *gin.Context) {
	var reportProblem []entity.ReportProblem
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Preload("FileUpload").Raw("SELECT * FROM report_Problems where status_id = 2").Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}

// DELETE /reportProblems/:id
func DeleteReportProblem(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM report_problems WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report_problems not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

type output struct {
	ID int
	id int
	NotiDate time.Time
	Heading          string
	Description      string
	Empname   string
	Status   string
	Department    string
	// FileUpload   string
}

func ListAdminReportProblem(c *gin.Context) {
    var output []output
    StaID := c.Param("id")
    if err := entity.DB().Table("report_problems").
        Select("report_problems.id, departments.id, statuses.id, employees.emp_name, statuses.name, departments.name, report_problems.heading, report_problems.description, report_problems.notification_date").
        Joins("INNER JOIN report_problems ON report_problems.id = report_problems.report_type_id").
        Joins("INNER JOIN employees ON employees.id = report_problems.employee_id").
        Joins("INNER JOIN departments ON departments.id = report_problems.department_id").
        Joins("INNER JOIN statuses ON statuses.id = report_problems.status_id").
        Where("statuses.id = ? AND report_problems.status = 'pending approval'", StaID).
        Find(&output).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": output})
}

// PATCH /reportProblem
func UpdateReportProblem(c *gin.Context) {
	var reportProblem entity.ReportProblem
	var newreportProblem entity.ReportProblem
	var Employee entity.Employee
	var status entity.Status
	var department entity.Department
	// var fileUpload entity.FileUpload

	if err := c.ShouldBindJSON(&newreportProblem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newreportProblem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// ค้นหา employee ด้วย id
	if newreportProblem.EmployeeID != nil {
		if tx := entity.DB().Where("id = ?", newreportProblem.EmployeeID).First(&Employee); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
			return
		}
		fmt.Print("NOT NULL")
		newreportProblem.Employee = Employee
	} else {
		if tx := entity.DB().Where("id = ?", newreportProblem.EmployeeID).First(&Employee); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not found employee"})
			return
		}
		fmt.Print("NULL")
		newreportProblem.Employee = Employee
	}
	// ค้นหา status ด้วย id
	if newreportProblem.StatusID != nil {
		if tx := entity.DB().Where("id = ?", newreportProblem.StatusID).First(&status); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "statuses not found"})
			return
		}
		newreportProblem.Status = status
	} else {
		if tx := entity.DB().Where("id = ?", newreportProblem.StatusID).First(&status); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not found statuses"})
			return
		}
		newreportProblem.Status = status
	}
	// ค้นหา department ด้วย id
	if newreportProblem.DepartmentID != nil {
		if tx := entity.DB().Where("id = ?", newreportProblem.DepartmentID).First(&department); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "departments not found"})
			return
		}
		newreportProblem.Department = department
	} else {
		if tx := entity.DB().Where("id = ?", newreportProblem.DepartmentID).First(&department); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": " not found departments"})
			return
		}
		newreportProblem.Department = department
	}
	// ค้นหา file ด้วย id
	// if newreportProblem.FileUploadID != nil {
	// 	if tx := entity.DB().Where("id = ?", newreportProblem.FileUploadID).First(&fileUpload); tx.RowsAffected == 0 {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "fileUploads not found"})
	// 		return
	// 	}
	// 	newreportProblem.FileUpload = fileUpload
	// } else {
	// 	if tx := entity.DB().Where("id = ?", newreportProblem.FileUploadID).First(&fileUpload); tx.RowsAffected == 0 {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": " not found fileUploads"})
	// 		return
	// 	}
	// 	newreportProblem.FileUpload = fileUpload
	// }

	reportProblem.Status = newreportProblem.Status

	update := entity.ReportProblem{
		NotificationDate: reportProblem.NotificationDate,
		Employee:         reportProblem.Employee,
		Department:       reportProblem.Department,
		Status:           reportProblem.Status,
		Heading:          reportProblem.Heading,
		Description:      reportProblem.Description,
		FileUpload:       reportProblem.FileUpload,
	}
	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", reportProblem.ID).Updates(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}
