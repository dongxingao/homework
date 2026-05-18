# Go Backend Directory Guide

本目录用于存放 `Mini-12306` 的 Go 后端代码。

## 目录结构

```text
src/backend/
  cmd/
    server/
  internal/
    config/
    database/
    handler/
    middleware/
    model/
    repository/
    router/
    service/
  pkg/
    response/
```

## 目录职责

### `cmd/server`

后端启动入口。

- 启动 HTTP 服务
- 加载配置
- 注册路由

### `internal/config`

项目配置。

- 数据库配置
- 服务端口
- 环境变量读取

### `internal/database`

数据库连接和初始化逻辑。

- 创建数据库连接
- 统一管理连接对象

### `internal/handler`

处理 HTTP 请求。

- 接收前端参数
- 调用 service
- 返回 JSON 响应

### `internal/middleware`

中间件。

- 登录校验
- 权限校验
- 错误处理

### `internal/model`

数据结构定义。

- 用户结构体
- 车次结构体
- 订单结构体
- 请求体和响应体结构体

### `internal/repository`

数据库操作层。

- 查询用户
- 新增订单
- 查询车次

### `internal/router`

路由注册。

- 定义接口路径
- 将接口绑定到 handler

### `internal/service`

业务逻辑层。

- 注册逻辑
- 登录逻辑
- 购票逻辑
- 退票逻辑

### `pkg/response`

可复用的公共工具。

- 统一响应格式
- 通用返回函数

## 推荐开发顺序

1. 先写 `cmd/server/main.go`
2. 再写 `router`
3. 再写一个最简单的 `handler`
4. 跑通测试接口
5. 再接数据库和业务逻辑

## 当前已落地的认证接口

当前后端已经先按前端最小字段方案实现了注册和登录。

### 旅客注册

- 路径：`POST /api/auth/register`
- 请求体：

```json
{
  "username": "zhangsan",
  "password": "123456"
}
```

说明：

- 当前只支持旅客注册
- 管理员不开放自助注册
- 这和前端当前的最小注册表单保持一致

### 登录

- 路径：`POST /api/auth/login`
- 请求体：

```json
{
  "username": "zhangsan",
  "password": "123456",
  "role": "passenger"
}
```

说明：

- `role` 可选，推荐前端登录页按当前身份入口传入
- 可选值：
  - `passenger`
  - `admin`

### 默认管理员账号

当前为了让管理员登录页有可用账号，服务启动时会自动预置：

- 用户名：`admin`
- 密码：`admin123456`

当前用户数据会写入 SQLite 数据库：

- 默认路径：`src/backend/data/mini12306.db`
- 可通过环境变量 `DB_PATH` 覆盖

这意味着现在的注册/登录已经是数据库版本，而不是纯内存 mock 或文件假存储。
