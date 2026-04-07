package admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"gitstore/internal/db"
	"gitstore/internal/middleware"
)

// ─── Credenciais dos criadores ────────────────────────────────────────────────
// Altere aqui para suas credenciais reais. Nunca exponha em repositório público.
var admins = map[string]string{
	"miguel": "gitstore@admin2026",
	"dev":    "devmaster#9901",
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

// POST /admin/login
func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonErr(w, "Requisição inválida.", http.StatusBadRequest)
		return
	}

	pass, ok := admins[body.Username]
	if !ok || pass != body.Password {
		// Delay para dificultar brute-force
		time.Sleep(500 * time.Millisecond)
		jsonErr(w, "Credenciais inválidas.", http.StatusUnauthorized)
		return
	}

	token, err := middleware.SignToken("admin:"+body.Username, body.Username+"@gitstore.internal")
	if err != nil {
		jsonErr(w, "Erro ao gerar token.", http.StatusInternalServerError)
		return
	}

	json200(w, map[string]any{
		"token": token,
		"admin": body.Username,
	})
}

// GET /admin/stats
func Stats(w http.ResponseWriter, r *http.Request) {
	database := db.Read()

	totalProjects := len(database.Projects)
	totalUsers := len(database.Users)

	freeCount, paidCount, freemiumCount := 0, 0, 0
	for _, p := range database.Projects {
		switch p.Type {
		case "free":
			freeCount++
		case "paid":
			paidCount++
		case "freemium":
			freemiumCount++
		}
	}

	json200(w, map[string]any{
		"users":    totalUsers,
		"projects": totalProjects,
		"byType": map[string]int{
			"free":     freeCount,
			"paid":     paidCount,
			"freemium": freemiumCount,
		},
		"dbPath": os.Getenv("DB_PATH"),
	})
}

// GET /admin/users
func ListUsers(w http.ResponseWriter, r *http.Request) {
	database := db.Read()
	// Retorna usuários sem passwordHash
	type safeUser struct {
		ID           string `json:"id"`
		Name         string `json:"name"`
		Username     string `json:"username"`
		Email        string `json:"email"`
		Experience   string `json:"experience"`
		Availability string `json:"availability"`
		CreatedAt    string `json:"createdAt"`
		HasGoogle    bool   `json:"hasGoogle"`
		HasPassword  bool   `json:"hasPassword"`
	}
	users := make([]safeUser, 0, len(database.Users))
	for _, u := range database.Users {
		users = append(users, safeUser{
			ID: u.ID, Name: u.Name, Username: u.Username, Email: u.Email,
			Experience: u.Experience, Availability: u.Availability, CreatedAt: u.CreatedAt,
			HasGoogle: u.GoogleID != "", HasPassword: u.PasswordHash != "",
		})
	}
	json200(w, map[string]any{"users": users, "total": len(users)})
}

// DELETE /admin/users/{id}
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		jsonErr(w, "ID obrigatório.", http.StatusBadRequest)
		return
	}

	database := db.Read()
	found := false
	newUsers := make([]db.User, 0, len(database.Users))
	for _, u := range database.Users {
		if u.ID == id {
			found = true
			continue
		}
		newUsers = append(newUsers, u)
	}
	if !found {
		jsonErr(w, "Usuário não encontrado.", http.StatusNotFound)
		return
	}
	database.Users = newUsers
	db.Write(database)
	w.WriteHeader(http.StatusNoContent)
}

// GET /admin/projects
func ListProjects(w http.ResponseWriter, r *http.Request) {
	database := db.Read()
	json200(w, map[string]any{"projects": database.Projects, "total": len(database.Projects)})
}

// DELETE /admin/projects/{id}
func DeleteProject(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		jsonErr(w, "ID obrigatório.", http.StatusBadRequest)
		return
	}

	database := db.Read()
	found := false
	newProjects := make([]db.Project, 0, len(database.Projects))
	for _, p := range database.Projects {
		if string(rune(p.ID)) == id || fmt.Sprintf("%d", p.ID) == id {
			found = true
			continue
		}
		newProjects = append(newProjects, p)
	}
	if !found {
		jsonErr(w, "Projeto não encontrado.", http.StatusNotFound)
		return
	}
	database.Projects = newProjects
	db.Write(database)
	w.WriteHeader(http.StatusNoContent)
}
