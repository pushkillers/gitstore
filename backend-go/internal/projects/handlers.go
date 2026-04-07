package projects

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"gitstore/internal/db"
)

func json200(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func jsonErr(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func nextID(projects []db.Project) int {
	max := 0
	for _, p := range projects {
		if p.ID > max {
			max = p.ID
		}
	}
	return max + 1
}

// GET /projects
func List(w http.ResponseWriter, r *http.Request) {
	database := db.Read()
	authorID := r.URL.Query().Get("authorId")

	if authorID != "" {
		filtered := make([]db.Project, 0)
		for _, p := range database.Projects {
			if p.AuthorID == authorID {
				filtered = append(filtered, p)
			}
		}
		json200(w, map[string]any{"projects": filtered})
		return
	}

	json200(w, map[string]any{"projects": database.Projects})
}

// POST /projects
func Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")

	var body struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Language    string   `json:"language"`
		Category    string   `json:"category"`
		Tags        []string `json:"tags"`
		Repository  string   `json:"repository"`
		Type        string   `json:"type"`
		Price       float64  `json:"price"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" || body.Language == "" {
		jsonErr(w, "Campos obrigatórios faltando.", http.StatusBadRequest)
		return
	}

	database := db.Read()

	// Resolve username
	author := userID
	for _, u := range database.Users {
		if u.ID == userID {
			author = u.Username
			break
		}
	}

	if body.Tags == nil {
		body.Tags = []string{}
	}
	projectType := body.Type
	if projectType == "" {
		projectType = "free"
	}

	project := db.Project{
		ID:          nextID(database.Projects),
		Name:        body.Name,
		Description: body.Description,
		AuthorID:    userID,
		Author:      author,
		Stars:       0,
		Language:    body.Language,
		Tags:        body.Tags,
		Repository:  body.Repository,
		CreatedAt:   time.Now().Format("2006-01-02"),
		Type:        projectType,
		Price:       body.Price,
		Category:    body.Category,
		Rating:      0,
		Downloads:   0,
	}

	database.Projects = append([]db.Project{project}, database.Projects...)
	if err := db.Write(database); err != nil {
		jsonErr(w, "Erro ao salvar projeto.", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json200(w, map[string]any{"project": project})
}

// PUT /projects/{id}
func Update(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	idStr := strings.TrimPrefix(r.URL.Path, "/projects/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		jsonErr(w, "ID inválido.", http.StatusBadRequest)
		return
	}

	var body map[string]any
	json.NewDecoder(r.Body).Decode(&body)

	database := db.Read()
	for i, p := range database.Projects {
		if p.ID != id {
			continue
		}
		if p.AuthorID != userID {
			jsonErr(w, "Sem permissão.", http.StatusForbidden)
			return
		}
		if v, ok := body["name"].(string); ok { database.Projects[i].Name = v }
		if v, ok := body["description"].(string); ok { database.Projects[i].Description = v }
		if v, ok := body["language"].(string); ok { database.Projects[i].Language = v }
		if v, ok := body["category"].(string); ok { database.Projects[i].Category = v }
		if v, ok := body["repository"].(string); ok { database.Projects[i].Repository = v }
		if v, ok := body["type"].(string); ok { database.Projects[i].Type = v }
		if v, ok := body["price"].(float64); ok { database.Projects[i].Price = v }
		if v, ok := body["tags"].([]any); ok {
			tags := make([]string, 0, len(v))
			for _, t := range v {
				if s, ok := t.(string); ok {
					tags = append(tags, s)
				}
			}
			database.Projects[i].Tags = tags
		}
		database.Projects[i].UpdatedAt = time.Now().Format("2006-01-02")
		db.Write(database)
		json200(w, map[string]any{"project": database.Projects[i]})
		return
	}
	jsonErr(w, "Projeto não encontrado.", http.StatusNotFound)
}

// DELETE /projects/{id}
func Delete(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	idStr := strings.TrimPrefix(r.URL.Path, "/projects/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		jsonErr(w, "ID inválido.", http.StatusBadRequest)
		return
	}

	database := db.Read()
	for i, p := range database.Projects {
		if p.ID != id {
			continue
		}
		if p.AuthorID != userID {
			jsonErr(w, "Sem permissão.", http.StatusForbidden)
			return
		}
		database.Projects = append(database.Projects[:i], database.Projects[i+1:]...)
		db.Write(database)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	jsonErr(w, "Projeto não encontrado.", http.StatusNotFound)
}
