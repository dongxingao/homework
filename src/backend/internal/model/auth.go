package model

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterResult struct {
	UserID   int64    `json:"userId"`
	Username string   `json:"username"`
	Role     UserRole `json:"role"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role,omitempty"`
}

type LoginResult struct {
	Token string      `json:"token"`
	User  UserSummary `json:"user"`
}
