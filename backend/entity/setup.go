package entity

import (
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
	)

	db = database

	//ตำแหน่งงาน
	role1 := Role{
		Name: "Employee",
	}
	db.Model(&Role{}).Create(&role1)

	role2 := Role{
		Name: "Admin",
	}
	db.Model(&Role{}).Create(&role2)

	// User
	password1, err := bcrypt.GenerateFromPassword([]byte("1234"), 14)
	password2, err := bcrypt.GenerateFromPassword([]byte("5678"), 14)

	userEmployee := User{
		UserName: "B111",
		Password: string(password2),
		Role:     role1,
	}
	db.Model(&User{}).Create(&userEmployee)

	userAdmin := User{
		UserName: "B222",
		Password: string(password1),
		Role:     role2,
	}
	db.Model(&User{}).Create(&userAdmin)

	Admin := Employee{
		EmployeeName: "Jirawat",
		Email:        "Jirawat@gmail.com",
		User:         userAdmin,
	}
	db.Model(&User{}).Create(&Admin)

	Employee1 := Employee{
		EmployeeName: "Napakan",
		Email:        "Napakan@gmail.com",
		User:         userAdmin,
	}
	db.Model(&User{}).Create(&Employee1)
	//-----------------------------------------------------------ระบบแจ้งปัญหา------------------------------------------
	//Status
	Status1 := Status{
		StatusName: "Send request",
	}
	db.Model(&Status{}).Create(&Status1)

	Status2 := Status{
		StatusName: "Pending",
	}
	db.Model(&Status{}).Create(&Status2)

	Status3 := Status{
		StatusName: "Complete",
	}
	db.Model(&Status{}).Create(&Status3)

	Status4 := Status{
		StatusName: "End",
	}
	db.Model(&Status{}).Create(&Status4)

	//Status
	Department1 := Department{
		DepartmentName: "บุคคล",
	}
	db.Model(&Department{}).Create(&Department1)

	Department2 := Department{
		DepartmentName: "ลูกค้าสัมพันธ์",
	}
	db.Model(&Department{}).Create(&Department2)

	Department3 := Department{
		DepartmentName: "บัญชี/การเงิน",
	}
	db.Model(&Department{}).Create(&Department3)

	Department4 := Department{
		DepartmentName: "การตลาด",
	}
	db.Model(&Department{}).Create(&Department4)

	//ระบบแจ้งปัญหา
	reportProblem := ReportProblem{
		Employee:         Employee1,
		Status:           Status1,
		NotificationDate: time.Now(),
		Department:       Department1,
	}
	db.Model(&ReportProblem{}).Create(&reportProblem)

}
