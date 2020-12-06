*: 需要 Token

+: 需要 Admin 權限

.: 需要擁有權限

-: 非遊客用戶組

## 要 Token (登入)

`POST /oauth2/token`

#### Body:

(使用標準 OAuth2 協議)

Key | Value
---- | ---
grant_type | "password"
username |  string 
password |  string

## 帳號管理

### 取得所有 Account 列表

`+GET /accounts`

### 新增一個帳號

`+POST /accounts`

#### Body:

Key | Value | Description
---- | --- | ---
username |  string |
password |  string |
[role] | role ["guest"] | 用戶所屬的用戶組

## 單帳號操作

### 取得一個帳號

`.GET /accounts/{id}`

### 取代

`.PUT /accounts/{id}`

權限: 本人或是管理員

#### Body:

Key | Value | Description
---- | --- | ---
username |  string |
password |  string |
[role] | role ["guest"] | 用戶所屬的用戶組

### 修改

`.PATCH /accounts/{id}`

放自己想修改的欄位就好

### 刪除
`.DELETE /accounts/{id}`

## 發註冊邀請碼

## 註冊

`POST /register/{TOKEN}`

#### Body:

(Role 由 token 決定好了)

Key | Value | Description
---- | --- | ---
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

## Group (翻譯組)

### 取得 Group 列表

`*GET /groups`

### 新增一個 Group

`+POST /groups`

#### Body

Key | Value | Description
---- | --- | ---
name |  string |
[description] |  string? |

### 取得一個 Group 的資訊

`GET /groups/{ID}`

### 刪除

`+DELETE /groups/{ID}`

### 取代

`+PUT /groups/{ID}`

#### Body

Key | Value | Description
---- | --- | ---
name |  string |
[description] |  string? |

### 更新

`+PATCH /groups/{ID}`

## AccountGroup

帳號所屬的組別

### 取得 AccountGroup 列表

`+GET /accountGroups`

### 新增一個 AccountGroup

`+POST /accountGroups`

#### Body

Key | Value | Description
---- | --- | ---
accountId |  int | 帳號 ID |
groupId |  int | Group ID |


### 取得一個 AccountGroup 的資訊

`+GET /accountGroups/{ID}`

### 刪除

`+DELETE /accountGroups/{ID}`

### 取代

`+PUT /accountGroups/{ID}`

#### Body

Key | Value | Description
---- | --- | ---
accountId |  int | 帳號 ID |
groupId |  int | Group ID |

### 更新

`+PATCH /accountGroups/{ID}`

### 查詢 (公用 API)

`*GET /accountGroups/find`

#### Params

Key | Value | Description
---- | --- | ---
[accountId] |  int | 帳號 ID |
[groupId] |  int | Group ID |

## Streamer

Youtuber

### 取得 Streamer 列表

`GET /streamer`

### 新增一個 Streamer

`-POST /streamer`

#### Body

Key | Value | Description
---- | --- | ---
name |  string | 名字 |
[url] |  string? | 網址 |
[description] |  string? | 簡介 |


### 取得一個 Streamer 的資訊

`GET /streamer/{ID}`

### 刪除

`-DELETE /streamer/{ID}`

### 取代

`-PUT /streamer/{ID}`

#### Body

Key | Value | Description
---- | --- | ---
name |  string | 名字 |
[url] |  string? | 網址 |
[description] |  string? | 簡介 |

### 更新

`+PATCH /accountGroups/{ID}`

## Video

影片

### 取得 Video 列表

`+GET /videos`

### 新增一個 Video

`-POST /videos`

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
streamerId | int | Streamer ID |
[name] | string? | 影片名稱 |
[thumbnail] | string? | 影片 Thumbnail 網址 |
[description] | string? | 影片簡介 |

### 取得一個 Video 的資訊

`GET /videos/{ID}`

### 刪除

`+DELETE /videos/{ID}`

### 取代

`-PUT /videos/{ID}`

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
streamerId | int | Streamer ID |
[name] | string? | 影片名稱 |
[thumbnail] | string? | 影片 Thumbnail 網址 |
[description] | string? | 影片簡介 |

### 更新

`-PATCH /videos/{ID}`

### 查詢某 Streamer 的所有影片

`GET /videos/streamer/{STREAMER_ID}`

## Video Timemark

影片時間軸標註

### 取得 Video Timemark 列表

`+GET /videoTimemark`

### 新增一個 Video Timemark

`-POST /videoTimemark`

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
videoId | int | 影片 ID |
startTime | int | 標註起點 (ms) |
endTime | int | 標註終點 (ms) |
[name] | string? | 標題 |
[description] | string? | 簡介 |

### 取得一個 Video Timemark 的資訊

`GET /videoTimemark/{ID}`

### 刪除

`-DELETE /videoTimemark/{ID}`

### 取代

`-PUT /videoTimemark/{ID}`

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
videoId | int | 影片 ID |
startTime | int | 標註起點 (ms) |
endTime | int | 標註終點 (ms) |
[name] | string? | 標題 |
[description] | string? | 簡介 |

### 更新

`-PATCH /videoTimemark/{ID}`

### 查詢某 Video 的所有 Video Timemark

`GET /videoTimemark/video/{VIDEO_ID}`

## Clip

由字幕組剪輯的影片分段

### 取得 Clip 列表

`+GET /clips`

### 新增一個 Clip

`.POST /clips`

權限: 該組組員或是管理員

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
groupId | int | Group ID |
[name] | string? | Clip 標題 |
[thumbnail] | string? | Clip Thumbnail URL |
[description] | string? |Clip  簡介 |

### 取得一個 Clip 的資訊

`GET /clips/{ID}`

### 刪除

`.DELETE /clips/{ID}`

權限: 該組組員或是管理員

### 取代

`.PUT /clips/{ID}`

權限: 該組組員或是管理員

#### Body

Key | Value | Description
---- | --- | ---
url | string | 影片網址 |
groupId | int | Group ID |
[name] | string? | Clip 標題 |
[thumbnail] | string? | Clip Thumbnail URL |
[description] | string? |Clip  簡介 |

### 更新

`.PATCH /clips/{ID}`

權限: 該組組員或是管理員

### 查詢 (公用 API)

`GET /clips/find`

#### Param

Key | Value | Description
---- | --- | ---
[videoId] | int? | Video ID |
[groupId] | int? | Group ID |

## ClipVideo

Clip 的來源 Video 時間軸片段資訊

### 取得 ClipVideo 列表

`+GET /clipVideo`

### 新增一個 ClipVideo

`.POST /clipVideo`

權限: 管理員或是 Clip 所屬組別

#### Body

Key | Value | Description
---- | --- | ---
clipId | int | Clip ID |
videoId | int | 影片 ID |
videoStartTime | int | Video 起點 (ms) |
videoEndTime | int | Video 終點 (ms) |
[description] | string? | 簡介 |

### 取得一個 ClipVideo 的資訊

`GET /clipVideo/{ID}`

### 刪除

`.DELETE /clipVideo/{ID}`

權限: 管理員或是 Clip 所屬組別

### 取代

`.PUT /clipVideo/{ID}`

權限: 管理員或是 Clip 所屬組別

#### Body

Key | Value | Description
---- | --- | ---
clipId | int | Clip ID |
videoId | int | 影片 ID |
videoStartTime | int | Video 起點 (ms) |
videoEndTime | int | Video 終點 (ms) |
[description] | string? | 簡介 |

### 更新

`.PATCH /clipVideo/{ID}`

### 查詢 (公用 API)

`GET /clipVideo/find`

#### Param

Key | Value | Description
---- | --- | ---
[clipId] | int? | Clip ID |
[videoId] | int? | 影片 ID |