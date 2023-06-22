package entity

import (
	// "image"
	
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {

	dsn := "super:Sang87958@tcp(117.121.217.183:38990)/bsv5?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect databasess")
	}
	database.AutoMigrate(
		&User{},
		&Department{},
		&Status{},
		&ReportProblem{},
		&FileUpload{},
		&UserAuthen{},
	)

	db = database
}