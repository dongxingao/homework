package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"

	"mini12306/backend/internal/model"
	"mini12306/backend/internal/repository"
)

var (
	ErrInvalidAuthInput = errors.New("invalid auth input")
	ErrUsernameExists   = errors.New("username exists")
	ErrInvalidRole      = errors.New("invalid role")
	ErrRoleMismatch     = errors.New("role mismatch")
	ErrInvalidLogin     = errors.New("invalid login")
)

type AuthService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

func (s *AuthService) SeedAdmin() error {
	ctx := context.Background()

	if _, exists, err := s.userRepo.FindByUsername(ctx, "admin"); err != nil {
		return err
	} else if exists {
		return nil
	}

	_, err := s.userRepo.Create(ctx, model.User{
		Username:     "admin",
		PasswordHash: hashPassword("admin123456"),
		Role:         model.RoleAdmin,
	})
	return err
}

func (s *AuthService) Register(req model.RegisterRequest) (model.RegisterResult, error) {
	ctx := context.Background()
	username := strings.TrimSpace(req.Username)
	password := strings.TrimSpace(req.Password)
	if username == "" || password == "" {
		return model.RegisterResult{}, ErrInvalidAuthInput
	}

	user := model.User{
		Username:     username,
		PasswordHash: hashPassword(password),
		Role:         model.RolePassenger,
	}

	savedUser, err := s.userRepo.Create(ctx, user)
	if err != nil {
		if errors.Is(err, repository.ErrUserAlreadyExists) {
			return model.RegisterResult{}, ErrUsernameExists
		}
		return model.RegisterResult{}, err
	}

	return model.RegisterResult{
		UserID:   savedUser.ID,
		Username: savedUser.Username,
		Role:     savedUser.Role,
	}, nil
}

func (s *AuthService) Login(req model.LoginRequest) (model.LoginResult, error) {
	ctx := context.Background()
	username := strings.TrimSpace(req.Username)
	password := strings.TrimSpace(req.Password)
	if username == "" || password == "" {
		return model.LoginResult{}, ErrInvalidAuthInput
	}

	user, exists, err := s.userRepo.FindByUsername(ctx, username)
	if err != nil {
		return model.LoginResult{}, err
	}
	if !exists || user.PasswordHash != hashPassword(password) {
		return model.LoginResult{}, ErrInvalidLogin
	}

	if req.Role != "" {
		expectedRole, err := mapPageRole(req.Role)
		if err != nil {
			return model.LoginResult{}, err
		}
		if user.Role != expectedRole {
			return model.LoginResult{}, ErrRoleMismatch
		}
	}

	token, err := generateToken()
	if err != nil {
		return model.LoginResult{}, err
	}

	return model.LoginResult{
		Token: token,
		User: model.UserSummary{
			ID:       user.ID,
			Username: user.Username,
			Role:     user.Role,
		},
	}, nil
}

func mapPageRole(role string) (model.UserRole, error) {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "passenger":
		return model.RolePassenger, nil
	case "admin":
		return model.RoleAdmin, nil
	default:
		return "", ErrInvalidRole
	}
}

// 课程版示例先用简单哈希避免明文存储，真实项目应改为 bcrypt 或 argon2。
func hashPassword(password string) string {
	sum := sha256.Sum256([]byte(password))
	return hex.EncodeToString(sum[:])
}

func generateToken() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}
