package handler

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"mini12306/backend/internal/model"
	"mini12306/backend/internal/service"
	"mini12306/backend/pkg/response"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.JSON(w, http.StatusMethodNotAllowed, 405, "请求方法不支持", nil)
		return
	}

	var req model.RegisterRequest
	if err := decodeJSON(r, &req); err != nil {
		response.JSON(w, http.StatusBadRequest, 400, "请求体格式错误", nil)
		return
	}

	result, err := h.authService.Register(req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidAuthInput):
			response.JSON(w, http.StatusBadRequest, 400, "请把用户名和密码填写完整", nil)
		case errors.Is(err, service.ErrUsernameExists):
			response.JSON(w, http.StatusBadRequest, 400, "用户名已存在", nil)
		default:
			response.JSON(w, http.StatusInternalServerError, 500, "注册失败", nil)
		}
		return
	}

	response.JSON(w, http.StatusOK, 0, "注册成功", result)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.JSON(w, http.StatusMethodNotAllowed, 405, "请求方法不支持", nil)
		return
	}

	var req model.LoginRequest
	if err := decodeJSON(r, &req); err != nil {
		response.JSON(w, http.StatusBadRequest, 400, "请求体格式错误", nil)
		return
	}

	result, err := h.authService.Login(req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidAuthInput):
			response.JSON(w, http.StatusBadRequest, 400, "请把用户名和密码填写完整", nil)
		case errors.Is(err, service.ErrInvalidRole):
			response.JSON(w, http.StatusBadRequest, 400, "登录角色不合法", nil)
		case errors.Is(err, service.ErrRoleMismatch):
			response.JSON(w, http.StatusForbidden, 403, "该账号不属于当前登录入口", nil)
		case errors.Is(err, service.ErrInvalidLogin):
			response.JSON(w, http.StatusBadRequest, 400, "用户名或密码错误", nil)
		default:
			response.JSON(w, http.StatusInternalServerError, 500, "登录失败", nil)
		}
		return
	}

	response.JSON(w, http.StatusOK, 0, "登录成功", result)
}

func decodeJSON(r *http.Request, dst any) error {
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(dst); err != nil {
		return err
	}

	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return errors.New("request body must contain a single json object")
	}

	return nil
}
