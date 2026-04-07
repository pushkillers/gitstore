package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"gitstore/internal/admin"
	"gitstore/internal/auth"
	"gitstore/internal/google"
	"gitstore/internal/middleware"
	"gitstore/internal/projects"

	_ "github.com/joho/godotenv/autoload"
)

func cors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	mux := http.NewServeMux()

	// Health
	mux.HandleFunc("GET /health", cors(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, `{"status":"ok","lang":"go"}`)
	}))

	// Auth
	mux.HandleFunc("POST /auth/register", cors(auth.Register))
	mux.HandleFunc("POST /auth/login",    cors(auth.Login))
	mux.HandleFunc("GET /auth/me",        cors(middleware.RequireAuth(auth.Me)))
	mux.HandleFunc("PUT /auth/profile",   cors(middleware.RequireAuth(auth.UpdateProfile)))
	mux.HandleFunc("GET /auth/users",     cors(auth.ListUsers))

	// Google OAuth
	mux.HandleFunc("GET /auth/google/login",         cors(google.Login))
	mux.HandleFunc("GET /auth/google/connect",       cors(google.Connect))
	mux.HandleFunc("GET /auth/google/callback",      cors(google.Callback))
	mux.HandleFunc("DELETE /auth/google/disconnect", cors(middleware.RequireAuth(google.Disconnect)))

	// Projects
	mux.HandleFunc("GET /projects", cors(projects.List))
	mux.HandleFunc("POST /projects", cors(middleware.RequireAuth(projects.Create)))
	mux.HandleFunc("/projects/", cors(func(w http.ResponseWriter, r *http.Request) {
		// strip trailing slash for bare /projects/
		if r.URL.Path == "/projects/" {
			projects.List(w, r)
			return
		}
		// only allow PUT and DELETE on /projects/{id}
		parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/projects/"), "/")
		if len(parts) != 1 || parts[0] == "" {
			http.NotFound(w, r)
			return
		}
		switch r.Method {
		case http.MethodPut:
			middleware.RequireAuth(projects.Update)(w, r)
		case http.MethodDelete:
			middleware.RequireAuth(projects.Delete)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	// Admin — acesso restrito aos criadores
	mux.HandleFunc("POST /admin/login",           cors(admin.Login))
	mux.HandleFunc("GET /admin/stats",            cors(middleware.RequireAuth(admin.Stats)))
	mux.HandleFunc("GET /admin/users",            cors(middleware.RequireAuth(admin.ListUsers)))
	mux.HandleFunc("DELETE /admin/users/{id}",    cors(middleware.RequireAuth(admin.DeleteUser)))
	mux.HandleFunc("GET /admin/projects",         cors(middleware.RequireAuth(admin.ListProjects)))
	mux.HandleFunc("DELETE /admin/projects/{id}", cors(middleware.RequireAuth(admin.DeleteProject)))

	log.Printf("✅ GitStore API (Go) rodando em http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
