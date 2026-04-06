package auth

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"gitstore/internal/db"
	"gitstore/internal/middleware"

	"golang.org/x/crypto/bcrypt"
)

func uuid() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func json200(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func jsonErr(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// POST /auth/register
func Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" || body.Email == "" || body.Password == "" {
		jsonErr(w, "Campos obrigatórios faltando.", http.StatusBadRequest)
		return
	}

	database := db.Read()
	for _, u := range database.Users {
		if strings.EqualFold(u.Email, body.Email) {
			jsonErr(w, "Email já cadastrado.", http.StatusConflict)
			return
		}
		if strings.EqualFold(u.Username, body.Username) {
			jsonErr(w, "Username já em uso.", http.StatusConflict)
			return
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		jsonErr(w, "Erro interno.", http.StatusInternalServerError)
		return
	}

	user := db.User{
		ID: uuid(), Name: body.Name, Username: body.Username,
		Email: body.Email, PasswordHash: string(hash),
		Avatar: "", AvatarZoom: 100, GitHub: body.Username,
		Availability: "Disponível para projetos", Experience: "Júnior",
		CreatedAt: time.Now().Format(time.RFC3339),
	}
	database.Users = append(database.Users, user)
	db.Write(database)

	token, _ := middleware.SignToken(user.ID, user.Email)
	json200(w, map[string]any{"token": token, "user": db.ToPublic(user)})
}

// POST /auth/login
func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&body)

	database := db.Read()
	var found *db.User
	for i, u := range database.Users {
		if strings.EqualFold(u.Email, body.Email) || strings.EqualFold(u.Username, body.Email) {
			found = &database.Users[i]
			break
		}
	}
	if found == nil {
		jsonErr(w, "Usuário não encontrado.", http.StatusUnauthorized)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(found.PasswordHash), []byte(body.Password)); err != nil {
		jsonErr(w, "Senha incorreta.", http.StatusUnauthorized)
		return
	}

	token, _ := middleware.SignToken(found.ID, found.Email)
	json200(w, map[string]any{"token": token, "user": db.ToPublic(*found)})
}

// GET /auth/me
func Me(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	database := db.Read()
	for _, u := range database.Users {
		if u.ID == userID {
			json200(w, map[string]any{
				"user":            db.ToPublic(u),
				"googleConnected": u.GoogleID != "",
				"googleEmail":     u.GoogleEmail,
			})
			return
		}
	}
	jsonErr(w, "Usuário não encontrado.", http.StatusNotFound)
}

// PUT /auth/profile
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	var updates map[string]any
	json.NewDecoder(r.Body).Decode(&updates)

	database := db.Read()
	for i, u := range database.Users {
		if u.ID != userID {
			continue
		}
		if v, ok := updates["name"].(string); ok { database.Users[i].Name = v }
		if v, ok := updates["username"].(string); ok { database.Users[i].Username = v }
		if v, ok := updates["bio"].(string); ok { database.Users[i].Bio = v }
		if v, ok := updates["location"].(string); ok { database.Users[i].Location = v }
		if v, ok := updates["website"].(string); ok { database.Users[i].Website = v }
		if v, ok := updates["company"].(string); ok { database.Users[i].Company = v }
		if v, ok := updates["twitter"].(string); ok { database.Users[i].Twitter = v }
		if v, ok := updates["linkedin"].(string); ok { database.Users[i].LinkedIn = v }
		if v, ok := updates["github"].(string); ok { database.Users[i].GitHub = v }
		if v, ok := updates["avatar"].(string); ok { database.Users[i].Avatar = v }
		if v, ok := updates["avatarZoom"].(float64); ok { database.Users[i].AvatarZoom = int(v) }
		if v, ok := updates["availability"].(string); ok { database.Users[i].Availability = v }
		if v, ok := updates["experience"].(string); ok { database.Users[i].Experience = v }
		db.Write(database)
		json200(w, map[string]any{"user": db.ToPublic(database.Users[i])})
		return
	}
	jsonErr(w, "Usuário não encontrado.", http.StatusNotFound)
}

// GET /auth/users — lista pública
func ListUsers(w http.ResponseWriter, r *http.Request) {
	database := db.Read()
	type publicMin struct {
		ID           string `json:"id"`
		Name         string `json:"name"`
		Username     string `json:"username"`
		Avatar       string `json:"avatar"`
		AvatarZoom   int    `json:"avatarZoom"`
		Bio          string `json:"bio"`
		Experience   string `json:"experience"`
		Availability string `json:"availability"`
	}
	users := make([]publicMin, 0, len(database.Users))
	for _, u := range database.Users {
		users = append(users, publicMin{
			ID: u.ID, Name: u.Name, Username: u.Username,
			Avatar: u.Avatar, AvatarZoom: u.AvatarZoom, Bio: u.Bio,
			Experience: u.Experience, Availability: u.Availability,
		})
	}
	json200(w, map[string]any{"users": users})
}
