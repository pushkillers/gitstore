package google

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"gitstore/internal/db"
	"gitstore/internal/middleware"

	"golang.org/x/oauth2"
	googleOAuth "golang.org/x/oauth2/google"
)

func uuid() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func frontendURL() string {
	if u := os.Getenv("FRONTEND_URL"); u != "" {
		return u
	}
	return "http://localhost:3000"
}

func oauthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("BACKEND_URL") + "/auth/google/callback",
		Scopes:       []string{"profile", "email"},
		Endpoint:     googleOAuth.Endpoint,
	}
}

func isConfigured() bool {
	id := os.Getenv("GOOGLE_CLIENT_ID")
	secret := os.Getenv("GOOGLE_CLIENT_SECRET")
	return id != "" && id != "cole_aqui" && secret != "" && secret != "cole_aqui"
}

// GET /auth/google/login
func Login(w http.ResponseWriter, r *http.Request) {
	if !isConfigured() {
		http.Redirect(w, r, frontendURL()+"/login?error=google_not_configured", http.StatusTemporaryRedirect)
		return
	}
	url := oauthConfig().AuthCodeURL("login", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// GET /auth/google/connect
func Connect(w http.ResponseWriter, r *http.Request) {
	if !isConfigured() {
		http.Redirect(w, r, frontendURL()+"/settings?error=google_not_configured", http.StatusTemporaryRedirect)
		return
	}
	rawToken := r.URL.Query().Get("auth")
	if rawToken == "" {
		http.Redirect(w, r, frontendURL()+"/login?callbackUrl=/settings", http.StatusTemporaryRedirect)
		return
	}
	userID, err := middleware.ParseToken(rawToken)
	if err != nil {
		http.Redirect(w, r, frontendURL()+"/login?callbackUrl=/settings", http.StatusTemporaryRedirect)
		return
	}
	state := "connect:" + userID
	url := oauthConfig().AuthCodeURL(state, oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// GET /auth/google/callback
func Callback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	isConnect := strings.HasPrefix(state, "connect:")

	if code == "" {
		dest := frontendURL() + "/login?error=cancelled"
		if isConnect {
			dest = frontendURL() + "/settings?error=cancelled"
		}
		http.Redirect(w, r, dest, http.StatusTemporaryRedirect)
		return
	}

	cfg := oauthConfig()
	token, err := cfg.Exchange(context.Background(), code)
	if err != nil {
		http.Redirect(w, r, frontendURL()+"/login?error=google_failed", http.StatusTemporaryRedirect)
		return
	}

	client := cfg.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Redirect(w, r, frontendURL()+"/login?error=google_failed", http.StatusTemporaryRedirect)
		return
	}
	defer resp.Body.Close()

	var info struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	json.NewDecoder(resp.Body).Decode(&info)

	if info.Email == "" {
		http.Redirect(w, r, frontendURL()+"/login?error=no_email", http.StatusTemporaryRedirect)
		return
	}

	database := db.Read()

	// CONNECT
	if isConnect {
		userID := strings.TrimPrefix(state, "connect:")
		for _, u := range database.Users {
			if u.GoogleID == info.ID && u.ID != userID {
				http.Redirect(w, r, frontendURL()+"/settings?error=google_already_linked", http.StatusTemporaryRedirect)
				return
			}
		}
		for i, u := range database.Users {
			if u.ID == userID {
				database.Users[i].GoogleID = info.ID
				database.Users[i].GoogleEmail = info.Email
				if database.Users[i].Avatar == "" {
					database.Users[i].Avatar = info.Picture
				}
				db.Write(database)
				http.Redirect(w, r, frontendURL()+"/settings?connected=google", http.StatusTemporaryRedirect)
				return
			}
		}
		http.Redirect(w, r, frontendURL()+"/settings?error=user_not_found", http.StatusTemporaryRedirect)
		return
	}

	// LOGIN
	var found *db.User
	for i, u := range database.Users {
		if u.GoogleID == info.ID || strings.EqualFold(u.Email, info.Email) {
			found = &database.Users[i]
			break
		}
	}

	if found == nil {
		base := strings.Split(info.Email, "@")[0]
		username := base
		for _, u := range database.Users {
			if strings.EqualFold(u.Username, username) {
				username = fmt.Sprintf("%s%d", base, time.Now().UnixMilli()%9000+1000)
				break
			}
		}
		newUser := db.User{
			ID: uuid(), Name: info.Name, Username: username,
			Email: info.Email, GoogleID: info.ID, GoogleEmail: info.Email,
			Avatar: info.Picture, AvatarZoom: 100, GitHub: username,
			Availability: "Disponível para projetos", Experience: "Júnior",
			CreatedAt: time.Now().Format(time.RFC3339),
		}
		database.Users = append(database.Users, newUser)
		found = &database.Users[len(database.Users)-1]
	} else {
		if found.GoogleID == "" {
			found.GoogleID = info.ID
			found.GoogleEmail = info.Email
		}
		if found.Avatar == "" {
			found.Avatar = info.Picture
		}
	}
	db.Write(database)

	jwtToken, _ := middleware.SignToken(found.ID, found.Email)
	userData, _ := json.Marshal(db.ToPublic(*found))
	encoded := base64.URLEncoding.EncodeToString(userData)
	http.Redirect(w, r, fmt.Sprintf("%s/auth/callback?token=%s&data=%s", frontendURL(), jwtToken, encoded), http.StatusTemporaryRedirect)
}

// DELETE /auth/google/disconnect
func Disconnect(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	database := db.Read()
	for i, u := range database.Users {
		if u.ID == userID {
			if u.PasswordHash == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": "Defina uma senha antes de desconectar o Google."})
				return
			}
			database.Users[i].GoogleID = ""
			database.Users[i].GoogleEmail = ""
			db.Write(database)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]bool{"ok": true})
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
}
