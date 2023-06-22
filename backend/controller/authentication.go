package controller

import (
	"crypto/tls"
	"log"
	"net/http"
	"net/smtp"
	"strings"

	"github.com/B6221928keng/Report/entity"
	"github.com/B6221928keng/Report/services"
	"github.com/gin-gonic/gin"
)

type LoginPayload struct {
	User     string `json:"username"`
	Password string `json:"user_pass"`
}

type UserResponse struct {
	Token      string `json:"token"`
	UserSerial uint   `json:"user_serial"`
	DepID      uint   `json:"dep_id"`
	UserPermission       int    `json:"user_permission"`
}

// POST /signin
func Signin(c *gin.Context) {
	var payload LoginPayload
	var login entity.UserAuthen
	var dep entity.Department

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ค้นหา login ด้วย Username ที่ผู้ใช้กรอกมา
	if err := entity.DB().Raw("SELECT * FROM bt_userauthen WHERE user_name = ?", payload.User).Scan(&login).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ตรวจสอบ Password
	err1 := services.VerifyPassword(login.Password, payload.Password)
	if err1 == false {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user credentials"})
		return
	}
	//ค้นหา Department ด้วย did
	if err := entity.DB().Raw("SELECT * FROM bt_department WHERE dep_id = ?", login.DepID).Scan(&dep).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	jwtWrapper := services.JwtWrapper{
		SecretKey:      "Secret",
		Issuer:         "AuthService",
		ExpirationHour: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(login.UserSerial, login.UserPermission)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
		tokenResponse := UserResponse{
			Token:    signedToken,
			UserSerial:  login.UserSerial,
			DepID: dep.DepID,
			UserPermission: login.UserPermission,
		}
		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}

// GET /valid
// validation token
func Validation(c *gin.Context) {
	clientToken := c.Request.Header.Get("Authorization")
	if clientToken == "" {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "No Authorization header provided",
		})
		return
	}

	extractedToken := strings.Split(clientToken, "Bearer ")

	if len(extractedToken) == 2 {
		clientToken = strings.TrimSpace(extractedToken[1])
	} else {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Incorrect Format of Authorization Token", "len": extractedToken})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "Secret",
		Issuer:    "AuthService",
	}

	claims, err := jwtWrapper.ValidateToken(clientToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "Valid Ok",
		"data":   claims,
	})
}

//--------------------------Employee---------------------------

type EmailData struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

// สร้างข้อมูล
func SendEmailEmp(c *gin.Context) {
	var data EmailData
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "แจ้งปัญหา"
	body := "ได้ส่งข้อมูลของปัญหา: " + "\n" +
		" " + "\n" +
		" " + "\n" +
		"ลิงก์: http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n" + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}

	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

func GetReportProblemByID(id string) (*entity.ReportProblem, error) {
	var reportProblem entity.ReportProblem
	if err := entity.DB().Preload("Employee").Preload("Status").Preload("Department").Preload("FileUpload").Raw("SELECT * FROM report_Problems WHERE id = ?", id).Find(&reportProblem).Error; err != nil {
		return nil, err
	}
	return &reportProblem, nil
}

type EmailDataUPDATE struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

// อัพเดพข้อมูล
func SendEmailEmpUPDATE(c *gin.Context) {
	var data EmailDataUPDATE
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "มีการอัพเดตข้อมูล"
	body := "ได้ส่งข้อมูลอัพเดตของปัญหา: " + "\n" +
		" " + "\n" +
		" " + "\n" +
		"ลิงก์: http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n" + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}

	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

// จบการทำงาน
type EmailDataEND struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

func SendEmailEmpEND(c *gin.Context) {
	var data EmailDataEND
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "ใช้งานได้ปกติ"
	body := "เสร็จสมบูรณ์ Software ใช้งานได้ปกติ " + "\n" +
		" " + "\n" +
		" " + "\n" +
		"ลิงก์: http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n" + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}

	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

//-----------------------Admin-------------------------------

// รับข้อมูล
type EmailAdmin struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

// กำลังแก้ไข
func SendEmailAdmin(c *gin.Context) {
	var data EmailAdmin
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "ได้รับข้อมูลแล้ว"
	body := "กำลังดำเนินการแก้ไข" + "\n" +
		" " + "\n" +
		"" + "\n" +
		"ลิงก์: http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n" + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}

	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

type EmailDataComplete struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

// แก้ไขเสร็จ
func SendEmailAdminComplete(c *gin.Context) {
	var data EmailDataComplete
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "ทำการแก้ไขเสร็จแล้ว"
	body := " ทำการแก้ไขเสร็จแล้วโปรดตรวจสอบด้วยครับ " + "\n" +
		" " + "\n" +
		" " + "\n" +
		"ลิงก์: http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n" + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}

	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
