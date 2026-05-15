# Web 应用工程化开发流程

适用项目：Mini-12306 软件系统  
适用团队：2 人小组  

## 一句话流程

```text
想清楚 -> 写下来 -> 设计数据 -> 定接口 -> 搭架子 -> 分头写 -> 联调 -> 测试 -> 部署 -> 交付
```

## 1. 明确目标

先用一句话说明项目要解决什么问题。

Mini-12306 的目标：

```text
让用户可以在线查询车次、购票、退票、改签，让管理员可以管理车次和余票。
```

## 2. 确定第一版范围

先做最小可运行版本，不要一开始做太大。

第一版建议做：

```text
用户注册
用户登录
查询车次
购票
查看订单
退票
改签
管理员管理车次
```

第一版先不做：

```text
真实身份证认证
真实短信验证码
真实在线支付
真实抢票
真实选座
APP 端
```

规则：

```text
不在第一版范围内的功能，先不写。
```

## 3. 写需求文档

需求文档的作用是让两个人对项目理解一致。

需求文档至少写这些内容：

```text
项目背景
用户角色
功能列表
业务流程
不做的功能
验收标准
```

Mini-12306 的角色可以先定为：

```text
游客：只能注册和登录
旅客：可以查票、购票、退票、改签
管理员：可以管理车次、票价、余票
```

## 4. 画页面

先画简单草图，不追求好看，先把页面关系想清楚。

页面可以包括：

```text
登录页
注册页
车次查询页
车次列表页
购票确认页
我的订单页
改签页
管理员车次管理页
```

规则：

```text
先让流程完整，再优化页面样式。
```

## 5. 设计数据库

先想清楚数据怎么存，再开始写代码。

最小版本可以先有三张核心表：

```text
users：用户表
trains：车次表
orders：订单表
```

用户表 users：

```text
id
username
password
real_name
id_card
phone
role
created_at
```

车次表 trains：

```text
id
train_no
from_station
to_station
departure_time
arrival_time
price
total_seats
remaining_seats
status
```

订单表 orders：

```text
id
order_no
user_id
train_id
passenger_name
id_card
price
status
created_at
paid_at
```

订单状态建议统一为：

```text
UNPAID：未支付
PAID：已支付
REFUNDED：已退票
CHANGED：已改签
CANCELLED：已取消
```

规则：

```text
数据库字段一旦确定，不能随便改。
如果要改，必须同步修改文档和接口。
```

## 6. 统一接口

前端和后端先约定怎么通信。

常用接口：

```text
POST /api/auth/register
POST /api/auth/login

GET /api/trains
POST /api/orders
GET /api/orders/my
POST /api/orders/{id}/refund
POST /api/orders/{id}/change

POST /api/admin/trains
PUT /api/admin/trains/{id}
DELETE /api/admin/trains/{id}
```

统一返回格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

失败返回：

```json
{
  "code": 400,
  "message": "余票不足",
  "data": null
}
```

规则：

```text
接口地址、请求参数、返回字段必须写进接口文档。
前端和后端都按接口文档开发。
```

## 7. 搭项目架子

建议项目目录：

```text
mini12306/
  docs/
  frontend/
  backend/
  database/
  README.md
```

docs 放文档：

```text
需求规格说明书.md
数据库设计.md
接口设计.md
测试用例.md
项目分工.md
```

database 放数据库脚本：

```text
schema.sql
init_data.sql
```

规则：

```text
文档、前端、后端、数据库分开放。
不要所有东西混在一个目录里。
```

## 8. 分工开发

2 人小组建议这样分：

```text
成员 A：前端页面、页面跳转、调用接口
成员 B：后端接口、数据库、业务逻辑
```

也可以按模块分：

```text
成员 A：登录、注册、查票、前端页面
成员 B：购票、退票、改签、管理员、数据库
```

规则：

```text
每个人负责的模块要写清楚。
每天同步一次进度。
卡住的问题及时说，不要憋到最后。
```

## 9. 先跑通主流程

不要一开始什么都写。

先跑通这条主流程：

```text
注册 -> 登录 -> 查询车次 -> 购票 -> 查看订单
```

主流程跑通后，再补：

```text
退票
改签
管理员车次管理
页面优化
异常处理
```

规则：

```text
主流程优先。
能跑起来比功能多更重要。
```

## 10. 联调

联调就是前端真正调用后端接口，看整个系统能不能连起来。

重点检查：

```text
接口地址是否正确
字段名是否一致
状态码是否一致
数据库数据是否正确变化
页面是否正确显示错误信息
```

常见问题：

```text
前端用 trainName，后端返回 train_no
前端传 userId，后端要 user_id
后端返回 PAID，前端判断 success
接口文档没更新
```

规则：

```text
接口改动必须通知对方。
接口文档必须同步更新。
```

## 11. 测试

每个功能都要测正常情况和异常情况。

登录测试：

```text
正确账号密码能登录
密码错误不能登录
用户不存在不能登录
```

购票测试：

```text
有余票时购票成功
无余票时购票失败
购票成功后余票减少
未登录用户不能购票
```

退票测试：

```text
已支付订单可以退票
已退票订单不能重复退票
退票后余票恢复
```

改签测试：

```text
已支付订单可以改签
改签到新车次后订单更新
原车次余票恢复
新车次余票减少
```

规则：

```text
一个功能写完，必须自己先测。
不要把明显跑不通的代码交给对方联调。
```

## 12. Git 协作规则

建议至少保留两个分支：

```text
main：稳定版本
dev：开发版本
```

如果想更规范，可以这样：

```text
main
dev
feature/login
feature/train-query
feature/order
feature/admin
```

提交规则：

```text
每次提交只做一类事情
提交信息写清楚
不要把不能运行的代码合进 main
合并前先自己跑一遍
```

提交信息例子：

```text
feat: add user login api
feat: add train query page
fix: fix remaining seats update bug
docs: add api document
```

## 13. 部署

部署就是把项目放到服务器上运行。

需要准备：

```text
前端构建
后端启动
数据库初始化
环境变量配置
端口开放
运行说明
```

规则：

```text
部署步骤必须写进 README。
换一台机器也要能按说明跑起来。
```

## 14. 交付

最终交付不只是代码。

建议交付内容：

```text
源代码
需求规格说明书
数据库设计
接口设计
测试用例
运行说明
项目截图
演示 PPT
```

最后验收时，至少能演示：

```text
用户注册
用户登录
查询车次
购买车票
查看订单
退票
改签
管理员维护车次
```

## 最终记忆版

```text
先定需求。
再定数据库。
再定接口。
然后写代码。
先跑主流程。
再补其他功能。
最后测试、部署、交付。
```

