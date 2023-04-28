package main

import (
	"os"

	"github.com/B6221928keng/Report/controller"

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

	

	//-----------------------------------แจ้งปัญหา------------------------------------
	r.POST("/reportProblems", controller.CreateReportProblem)
	r.GET("/reportProblem", controller.ListReportProblem)
	r.GET("/reportProblemstatus1", controller.ListReportProblemStatusID1)
	r.GET("/reportProblemstatus2", controller.ListReportProblemStatusID2)
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
	//File
	// r.GET("/upload/:id", controller.GetFileUpload )
	// r.GET("/uploads", controller.ListFileUpload)
	// r.POST("/upload", controller.GetFileUploadmain)
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

	
	r.Run()
}
