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
	r.GET("/reportProblemHome", controller.ListReportProblemHome)
	r.GET("/reportProblemstatus1", controller.ListReportProblemStatusID1)
	r.GET("/reportProblemstatus2", controller.ListReportProblemStatusID2)
	r.GET("/reportProblemstatus3", controller.ListReportProblemStatusID3)
	r.GET("/reportProblemstatus4", controller.ListReportProblemStatusID4)
	r.GET("/reportProblem/:id", controller.GetReportProblem)
	r.GET("/adminReportProblem/:id", controller.ListAdminReportProblem)

	r.PATCH("/reportProblem", controller.UpdateReportProblem)
	r.PATCH("/reportProblemE", controller.UpdateReportProblemUser)
	
	r.DELETE("/reportProblems/:id", controller.DeleteReportProblem)
	//Status
	r.GET("/statuses", controller.ListStatus)

	//-----------------------------------ระบบ------------------------------------

	//File
	r.GET("/fileUploads", controller.ListFileUploads)
	r.GET("/downloadFile/:id", controller.DownloadFile)
	r.POST("/uploadfile", controller.UploadFile)
	r.PATCH("/updateFile/:id", controller.UpdateUploadFile)
	r.DELETE("/fileUploads/:id", controller.DeleteFileUpload)

	// r.GET("/employeeId/:id", controller.GetEmployeeByUserID)
	// r.GET("/employees", controller.ListEmployee)
	// r.GET("/employeeID/:id", controller.GetEmployee)

	//Department
	r.GET("/departments", controller.ListDepartment)
	r.GET("/department/:id", controller.GetDepartment)

	// User
	// r.POST("/user", controller.CreateUser)
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
