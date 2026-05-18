package model

type UserRole string

const (
	RolePassenger UserRole = "PASSENGER"
	RoleAdmin     UserRole = "ADMIN"
)

type User struct {
	ID           int64
	Username     string
	PasswordHash string
	Role         UserRole
}

type StoredUser struct {
	ID           int64    `json:"id"`
	Username     string   `json:"username"`
	PasswordHash string   `json:"passwordHash"`
	Role         UserRole `json:"role"`
}

type UserSummary struct {
	ID       int64    `json:"id"`
	Username string   `json:"username"`
	Role     UserRole `json:"role"`
}
