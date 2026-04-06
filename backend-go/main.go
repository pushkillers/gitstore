package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"gitstore/internal/auth"
	"gitstore/internal/google"
	"gitstore/internal/middleware"

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
	mux.HandleFunc("GET /auth/google/login",       cors(google.Login))
	mux.HandleFunc("GET /auth/google/connect",     cors(google.Connect))
	mux.HandleFunc("GET /auth/google/callback",    cors(google.Callback))
	mux.HandleFunc("DELETE /auth/google/disconnect", cors(middleware.RequireAuth(google.Disconnect)))

	log.Printf("✅ GitStore API (Go) rodando em http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
