package db

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"sync"
)

type User struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	PasswordHash string `json:"passwordHash,omitempty"`
	GoogleID     string `json:"googleId,omitempty"`
	GoogleEmail  string `json:"googleEmail,omitempty"`
	Avatar       string `json:"avatar"`
	AvatarZoom   int    `json:"avatarZoom"`
	Bio          string `json:"bio"`
	Location     string `json:"location"`
	Website      string `json:"website"`
	Company      string `json:"company"`
	Twitter      string `json:"twitter"`
	LinkedIn     string `json:"linkedin"`
	GitHub       string `json:"github"`
	Availability string `json:"availability"`
	Experience   string `json:"experience"`
	CreatedAt    string `json:"createdAt"`
}

type PublicUser struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	GoogleID     string `json:"googleId,omitempty"`
	GoogleEmail  string `json:"googleEmail,omitempty"`
	Avatar       string `json:"avatar"`
	AvatarZoom   int    `json:"avatarZoom"`
	Bio          string `json:"bio"`
	Location     string `json:"location"`
	Website      string `json:"website"`
	Company      string `json:"company"`
	Twitter      string `json:"twitter"`
	LinkedIn     string `json:"linkedin"`
	GitHub       string `json:"github"`
	Availability string `json:"availability"`
	Experience   string `json:"experience"`
	CreatedAt    string `json:"createdAt"`
}

type Database struct {
	Users []User `json:"users"`
}

var (
	mu     sync.RWMutex
	dbPath string
)

func init() {
	_, filename, _, _ := runtime.Caller(0)
	dbPath = filepath.Join(filepath.Dir(filename), "../../../db.json")
}

func Read() Database {
	mu.RLock()
	defer mu.RUnlock()

	data, err := os.ReadFile(dbPath)
	if err != nil {
		return Database{Users: []User{}}
	}
	var db Database
	if err := json.Unmarshal(data, &db); err != nil {
		return Database{Users: []User{}}
	}
	return db
}

func Write(db Database) error {
	mu.Lock()
	defer mu.Unlock()

	data, err := json.MarshalIndent(db, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(dbPath, data, 0644)
}

func ToPublic(u User) PublicUser {
	return PublicUser{
		ID: u.ID, Name: u.Name, Username: u.Username, Email: u.Email,
		GoogleID: u.GoogleID, GoogleEmail: u.GoogleEmail,
		Avatar: u.Avatar, AvatarZoom: u.AvatarZoom, Bio: u.Bio,
		Location: u.Location, Website: u.Website, Company: u.Company,
		Twitter: u.Twitter, LinkedIn: u.LinkedIn, GitHub: u.GitHub,
		Availability: u.Availability, Experience: u.Experience, CreatedAt: u.CreatedAt,
	}
}
