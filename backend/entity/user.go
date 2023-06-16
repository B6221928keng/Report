package entity

type UserAuthen struct {
	UserSerial uint   `gorm:"primaryKey" db:"user_serial" `
	UserName   string `db:"user_name"`
	Password   string `db:"password"`
	Role       int    `db:"role_id"`
	DepID      int    `db:"dep_id"`
	Department Department `gorm:"foreignKey:DepID"`
}

type User struct {
	UserSerial       	uint 		`db:"user_no"`
	UserLname		string		`db:"user_lname"`
	UserAuthenId	int			`db:"user_serial"`
}
type Department struct {	
	DepID       uint   `gorm:"primaryKey" db:"dep_id" json:"dep_id"`
	DepName     string `db:"dep_name"`
	DepMail     string `db:"dep_mail"`
	ManagerMail string `db:"manager_mail"`
	reportProblem []ReportProblem `gorm:"foreignKey:DepID"`
}