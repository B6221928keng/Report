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
	Password string `json:"password"`
}

type EmployeeResponse struct {
	Token          string
	UserID         uint   `json:"user_id"`
	EmpID          uint   `json:"p_id"`
	RoleName       string `json:"role_name"`
	DepartmentName string `json:"department_name"`
}

// POST /signin
func Signin(c *gin.Context) {
	var payload LoginPayload
	var login entity.User
	var role entity.Role
	var dep entity.Department

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ค้นหา login ด้วย Username ที่ผู้ใช้กรอกมา
	if err := entity.DB().Raw("SELECT * FROM users WHERE user_name = ?", payload.User).Scan(&login).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ตรวจสอบ Password
	err := services.VerifyPassword(login.Password, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user credentials"})
		return
	}

	//ค้นหา Role ด้วย role_id
	if err := entity.DB().Raw("SELECT * FROM roles WHERE id = ?", login.RoleID).Scan(&role).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//ค้นหา Department ด้วย role_id
	if err := entity.DB().Raw("SELECT * FROM departments WHERE id = ?", login.DepartmentID).Scan(&dep).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:      "Secret",
		Issuer:         "AuthService",
		ExpirationHour: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(login.ID, role.Name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
	var emp entity.Employee
	if tx := entity.DB().
		Raw("SELECT * FROM employees WHERE user_id = ?", login.ID).Find(&emp); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
		return
	}
	tokenResponse := EmployeeResponse{
		Token:          signedToken,
		UserID:         login.ID,
		EmpID:          emp.ID,
		RoleName:       role.Name,
		DepartmentName: dep.DepartmentName,
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

type EmailData struct {
	Role     string `json:"employee"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Empemail string `json:"empemail"`
}

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
	body := "ได้ส่งข้อมูลของปัญหา http://localhost:3000"


	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

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

type EmailData1 struct {
	Role     string `json:"admin"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Adminemail string `json:"adminemail"`
}

func SendEmailAdmin(c *gin.Context) {
	var data EmailData1
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.email.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Adminemail}

	// Email content
	subject := "ได้รับข้อมูลเกี่ยวกับปัญหาแล้ว"
	body := "กำลังดำเนินการแก้ไข http://localhost:3000"

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

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
