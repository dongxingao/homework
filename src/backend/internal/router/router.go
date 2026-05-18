package router

import (
	"net/http"

	"mini12306/backend/internal/handler"
	"mini12306/backend/pkg/response"
)

func New(authHandler *handler.AuthHandler) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/auth/register", authHandler.Register)
	mux.HandleFunc("/api/auth/login", authHandler.Login)
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, 0, "success", map[string]string{
			"status": "ok",
		})
	})

	return mux
}
