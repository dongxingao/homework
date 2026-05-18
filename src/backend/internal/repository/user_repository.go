package repository

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"mini12306/backend/internal/model"
)

var ErrUserAlreadyExists = errors.New("user already exists")

type UserRepository interface {
	Create(ctx context.Context, user model.User) (model.User, error)
	FindByUsername(ctx context.Context, username string) (model.User, bool, error)
}

type SQLiteUserRepository struct {
	db *sql.DB
}

func NewSQLiteUserRepository(db *sql.DB) *SQLiteUserRepository {
	return &SQLiteUserRepository{db: db}
}

func (r *SQLiteUserRepository) Create(ctx context.Context, user model.User) (model.User, error) {
	username := normalizeUsername(user.Username)

	result, err := r.db.ExecContext(
		ctx,
		`INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
		username,
		user.PasswordHash,
		string(user.Role),
	)
	if err != nil {
		if isUniqueConstraintError(err) {
			return model.User{}, ErrUserAlreadyExists
		}
		return model.User{}, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return model.User{}, err
	}

	user.ID = id
	user.Username = username
	return user, nil
}

func (r *SQLiteUserRepository) FindByUsername(ctx context.Context, username string) (model.User, bool, error) {
	row := r.db.QueryRowContext(
		ctx,
		`SELECT id, username, password_hash, role FROM users WHERE username = ?`,
		normalizeUsername(username),
	)

	var user model.User
	var role string
	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &role); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return model.User{}, false, nil
		}
		return model.User{}, false, err
	}

	user.Role = model.UserRole(role)
	return user, true, nil
}

func normalizeUsername(username string) string {
	return strings.TrimSpace(strings.ToLower(username))
}

func isUniqueConstraintError(err error) bool {
	return strings.Contains(strings.ToLower(err.Error()), "unique")
}
