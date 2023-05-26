package main

import (
	"os"
	// "time"

	"github.com/B6221928keng/Report/controller"
	//  "gorm.io/gorm"

	"github.com/B6221928keng/Report/entity"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
func main() {
	os.Remove("./Report.db")
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// resetIDDaily()

	//-----------------------------------แจ้งปัญหา------------------------------------
	r.POST("/reportProblems", controller.CreateReportProblem)
	r.GET("/reportProblem", controller.ListReportProblem)
	r.GET("/reportProblemstatus1", controller.ListReportProblemStatusID1)
	r.GET("/reportProblemstatus2", controller.ListReportProblemStatusID2)
	r.GET("/reportProblemstatus3", controller.ListReportProblemStatusID3)
	r.GET("/reportProblemstatus4", controller.ListReportProblemStatusID4)
	r.GET("/reportProblem/:id", controller.GetReportProblem)
	r.GET("/adminReportProblem/:id", controller.ListAdminReportProblem)
	r.PATCH("/reportProblem", controller.UpdateReportProblem)
	r.DELETE("/reportProblems/:id", controller.DeleteReportProblem)
	//Status
	r.GET("/statuses", controller.ListStatus)

	//-----------------------------------ระบบ------------------------------------

	//Employee
	r.GET("/employeeId/:id", controller.GetEmployeeByUserID)
	r.GET("/employees", controller.ListEmployee)
	r.GET("/employeeID/:id", controller.GetEmployee)

	//Admin
	r.GET("/adminId/:id", controller.GetAdminByUserID)
	r.GET("/admins", controller.ListAdmin)
	r.GET("/adminID/:id", controller.GetAdmin)

	//File
	r.GET("/fileUploads", controller.ListFileUploads)
	r.GET("/downloadFile/:id", controller.DownloadFile)
	r.POST("/uploadfile", controller.UploadFile)

	//role
	r.GET("/roles", controller.ListRole)

	//Department
	r.GET("/departments", controller.ListDepartment)
	r.GET("/employeeUId/:id", controller.GetEmployeeByUserID)

	// User
	r.POST("/user", controller.CreateUser)
	r.GET("/users", controller.ListUser)
	r.GET("/users/:id", controller.GetUser)
	r.POST("/signin", controller.Signin)
	r.GET("/valid", controller.Validation)

	//Email
	//แจ้งปัญหา
	r.POST("/Email", controller.SendEmailEmp)
	//อัพเดตปัญหา
	r.POST("/Emailupdate", controller.SendEmailEmpUPDATE)
	//จบการทำงาน
	r.POST("/EmailEND", controller.SendEmailEmpEND)
	//กำลังแก้ไข
	r.POST("/Amail", controller.SendEmailAdmin)
	//แก้ไข้เสร็จ
	r.POST("/AmailComplete", controller.SendEmailAdminComplete)

	r.Run()
}
// func resetIDDaily() {
// 	go func() {
// 		for {
// 			now := time.Now()
// 			nextDay := now.Add(24 * time.Hour)
// 			nextDay = time.Date(nextDay.Year(), nextDay.Month(), nextDay.Day(), 0, 0, 0, 0, nextDay.Location())

// 			duration := nextDay.Sub(now)
// 			time.Sleep(duration)

// 			resetID()
// 		}
// 	}()
// }
// func resetID() {
// 	db := entity.DB()
// 	if err := db.Transaction(func(tx *gorm.DB) error {
// 		// รีเซ็ตค่า ID ใหม่ทุกวัน
// 		if err := tx.Exec("UPDATE report_problems SET id = 1").Error; err != nil {
// 			return err
// 		}

// 		// อัพเดทค่าตัวเลขต่อไปของตาราง report_problems
// 		if err := tx.Exec("SELECT setval('report_problems_id_seq', (SELECT MAX(id) FROM report_problems))").Error; err != nil {
// 			return err
// 		}

// 		return nil
// 	}); err != nil {
// 		// การจัดการข้อผิดพลาดในการรีเซ็ตค่า ID
// 		// คุณสามารถปรับเปลี่ยนการจัดการข้อผิดพลาดตามความเหมาะสม
// 		// เช่น บันทึกลงไฟล์รายละเอียดข้อผิดพลาด แจ้งเตือนผู้ดูแลระบบ เป็นต้น
// 		// ตัวอย่างนี้จะแสดงข้อผิดพลาดทางคอนโซลเท่านั้น
// 		panic(err)
// 	}
// }