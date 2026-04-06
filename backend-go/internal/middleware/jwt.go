package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func jwtSecret() []byte {
	s := os.Getenv("JWT_SECRET")
	if s == "" {
		s = "gitstore-secret-dev"
	}
	return []byte(s)
}

func SignToken(id, email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    id,
		"email": email,
		"exp":   time.Now().Add(30 * 24 * time.Hour).Unix(),
	})
	return token.SignedString(jwtSecret())
}

func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método inválido")
		}
		return jwtSecret(), nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("token inválido")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("claims inválidas")
	}
	id, _ := claims["id"].(string)
	return id, nil
}

// RequireAuth middleware — injeta userID no header X-User-ID
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			http.Error(w, `{"error":"Token não fornecido."}`, http.StatusUnauthorized)
			return
		}
		id, err := ParseToken(strings.TrimPrefix(auth, "Bearer "))
		if err != nil {
			http.Error(w, `{"error":"Token inválido."}`, http.StatusUnauthorized)
			return
		}
		r.Header.Set("X-User-ID", id)
		next(w, r)
	}
}
