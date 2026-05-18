package main

import (
	"errors"
	"log"
	"net/http"
	"time"

	"mini12306/backend/internal/config"
	"mini12306/backend/internal/database"
	"mini12306/backend/internal/handler"
	"mini12306/backend/internal/repository"
	"mini12306/backend/internal/router"
	"mini12306/backend/internal/service"
)

func main() {
	cfg := config.Load()

	db, err := database.OpenSQLite(cfg.DBPath)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	if err := database.EnsureSchema(db); err != nil {
		log.Fatalf("ensure schema: %v", err)
	}

	userRepo := repository.NewSQLiteUserRepository(db)
	authService := service.NewAuthService(userRepo)
	if err := authService.SeedAdmin(); err != nil {
		log.Fatalf("seed admin: %v", err)
	}

	authHandler := handler.NewAuthHandler(authService)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router.New(authHandler),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("mini12306 backend listening on :%s", cfg.Port)

	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("listen and serve: %v", err)
	}
}
