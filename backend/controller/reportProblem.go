package controller

import (
	"net/http"

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

	// 12: สร้าง ReportProblem
	wv := entity.ReportProblem{
		NotificationDate: reportProblem.NotificationDate,
		Heading:          reportProblem.Heading,
		Description:      reportProblem.Description,
		Employee:         Employee,
		Status:           status,
		Department:       department,
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
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Raw("SELECT * FROM report_Problems").Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}

func ListReportProblemStatusID(c *gin.Context) {
	var reportProblem []entity.ReportProblem
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Raw("SELECT * FROM report_Problems where status_id = 1").Find(&reportProblem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reportProblem})
}

// DELETE /reportProblems/:id
func DeleteReportProblem(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM s WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reportProblem not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /reportProblem
func UpdateReportProblem(c *gin.Context) {
	var reportProblem entity.ReportProblem
	var Employee entity.Employee
	var status entity.Status
	var department entity.Department

	if err := c.ShouldBindJSON(&reportProblem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", reportProblem.EmployeeID).First(&Employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}
	if tx := entity.DB().Where("id = ?", reportProblem.StatusID).First(&status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบฉลากยา"})
		return
	}
	if tx := entity.DB().Where("id = ?", reportProblem.DepartmentID).First(&department); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบโซนยา"})
		return
	}

	update := entity.ReportProblem{
		NotificationDate: reportProblem.NotificationDate,
		Employee:         reportProblem.Employee,
		Department:       reportProblem.Department,
		Status:           reportProblem.Status,
		Heading:          reportProblem.Heading,
		Description:      reportProblem.Description,
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
