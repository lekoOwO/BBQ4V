*: 需要 Token

+: 需要 Admin 權限

## 要 Token (登入)

`POST /oauth2/token`

#### Body:

(使用標準 OAuth2 協議)

Key | Value
---- | ---
grant_type | "password"
username |  string 
password |  string

## *帳號管理

### 取得所有 Account 列表

`+GET /accounts`

### 新增一個帳號

`+POST /accounts`

#### Body:

Key | Value | Description
---- | --- | ---
id | int | 正常留空 |
username |  string |
password |  string |
role | role ["guest"] | 用戶所屬的用戶組

## 註冊

`POST /register/{TOKEN}`

#### Body:

(Role 由 token 決定好了)

Key | Value | Description
---- | --- | ---
id | int | 正常留空 |
username |  string |
password |  string |

## 邀請註冊 (register 用的 token)

### 取得所有邀請碼列表

`+GET /invite`

### 新增一個邀請碼

`+POST /invite`

Key | Value | Description
---- | --- | ---
role |  role | 用邀請碼註冊的用戶屬於哪個用戶組
remaining | int [1] | 邀請碼可以用幾次

### 取得一個邀請碼的相關資訊

`*GET /invite/{TOKEN}`

### 刪除一個邀請碼

`+DELETE /invite/{TOKEN}`
