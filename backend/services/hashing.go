package services

import "golang.org/x/crypto/bcrypt"

func Hash(password string) (string, error) {
	byte, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(byte), err
}

func VerifyPassword(password1, password2 string) bool {
    return password1 == password2
}
