package entity

import (
	// "image"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {

	database, err := gorm.Open(sqlite.Open("Report.db"), &gorm.Config{})
	// Migrate the schema
	if err != nil {

		panic("failed to connect database")

	}
	database.AutoMigrate(
		&Role{},
		&User{},
		&Department{},
		&Status{},
		&ReportProblem{},
		&Employee{},
		&FileUpload{},
	)

	db = database

	//Status
	Status1 := Status{
		StatusName: "Send request",
	}
	Status2 := Status{
		StatusName: "Pending",
	}
	Status3 := Status{
		StatusName: "Complete",
	}
	Status4 := Status{
		StatusName: "End",
	}
	db.Model(&Status{}).Create(&Status1)
	db.Model(&Status{}).Create(&Status2)
	db.Model(&Status{}).Create(&Status3)
	db.Model(&Status{}).Create(&Status4)

	//Department
	Department1 := Department{
		DepartmentName: "บุคคล",
	}
	Department2 := Department{
		DepartmentName: "ลูกค้าสัมพันธ์",
	}
	Department3 := Department{
		DepartmentName: "บัญชี/การเงิน",
	}
	Department4 := Department{
		DepartmentName: "การตลาด",
	}
	Department5 := Department{
		DepartmentName: "IT",
	}
	db.Model(&Department{}).Create(&Department1)
	db.Model(&Department{}).Create(&Department2)
	db.Model(&Department{}).Create(&Department3)
	db.Model(&Department{}).Create(&Department4)
	db.Model(&Department{}).Create(&Department5)

	//ตำแหน่งงาน
	role1 := Role{
		Name: "employee",
	}
	db.Model(&Role{}).Create(&role1)

	role2 := Role{
		Name: "admin",
	}
	db.Model(&Role{}).Create(&role2)

	// User
	password1, err := bcrypt.GenerateFromPassword([]byte("1234"), 14)
	if err != nil {
		return
	}
	password2, err := bcrypt.GenerateFromPassword([]byte("5678"), 14)
	if err != nil {
		return
	}

	

	userEmployee := User{
		UserName:   "B111",
		Password:   string(password1),
		Role:       role1,
		Department: Department1,
	}
	db.Model(&User{}).Create(&userEmployee)

	userAdmin := User{
		UserName:   "B222",
		Password:   string(password2),
		Role:       role2,
		Department: Department5,
	}
	db.Model(&User{}).Create(&userAdmin)

	Admin := Employee{
		EmployeeName: "Jirawat",
		Email:        "Jirawat@gmail.com",
		User:         userAdmin,
		Role:         role2,
		Department:   Department5,
	}
	db.Model(&Employee{}).Create(&Admin)

	Employee1 := Employee{
		EmployeeName: "Napakan",
		Email:        "Napakan@gmail.com",
		User:         userEmployee,
		Role:         role1,
		Department:   Department1,
	}
	db.Model(&Employee{}).Create(&Employee1)

	FileUpload1 := FileUpload{
		Name:    "file1.txt",
		Size:    1000,
		Type:    "text/plain",
		Content: []byte("This is a test file"),
	}
	db.Model(&FileUpload{}).Create(&FileUpload1)

	//-----------------------------------------------------------ระบบแจ้งปัญหา------------------------------------------

	//ระบบแจ้งปัญหา
	reportProblem := ReportProblem{
		Employee:         Employee1,
		Department:       Department1,
		Heading:          "กรอกหัวข้อ",
		Description:      "กรอกรายละเอียด",
		Status:           Status1,
		NotificationDate: time.Now(),
		FileUpload:       FileUpload1,
	}
	db.Model(&ReportProblem{}).Create(&reportProblem)

}
