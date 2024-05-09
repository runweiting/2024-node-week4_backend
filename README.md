# 打造全端 (Full Stack) 網站架構

## A. 建立 express --no-view 專案

### 1. 建立環境

- cd 資料夾
- express --no-view 專案名稱
- cd 專案名稱
- npm install
- npm start

---

### 2. 安裝套件

- `npm install cors mongoose dotenv`

---

### 3. 建立 .gitignore

1.  ```
       config.env
       node_modules/
       .DS_Store
    ```
2.  `git init` `git add .`
3.  `git status` 確認 ignore 是否正確忽略
4.  建立新的 Git repo
5.  git commit -m "建立環境"
6.  連線至遠端 Git repo

### 4. 載入 cors、app.use(cors())

### 5. 載入 mongoose 連線至 mongoDB 端資料庫

1.  本地端資料庫

    - mongod
      `mongod --dbpath data 資料夾路徑--logpath mongo.log 資料夾路徑`
    - mongosh
      `mongosh`

2.  遠端資料庫
3.  建立 **config.env**

    - DATABASE=mongodb+srv://runweiting:<password>@cluster0.3hr0gmk.mongodb.net/新增 DB 名稱?retryWrites=true&w=majority&appName=Cluster0
    - DATABASE_PASSWORD=密碼

4.  建立 **example.env**
5.  建立 **connections/index.js**

    - 載入 mongoose、dotenv
    - 匯入 dotenv.config({ path: "./config.env" })
    - const DB = ...
    - mongoose.connect(DB)...

6.  在 app.js 匯入
    - require("./connections");

---

### 6. 建立 models

1. 建立 postsModel.js
2. 建立 usersModels.js

---

### 7. 編輯 app.js

1. 404
2. controllers/posts.js
   - 撰寫匯入 handler
   - 匯入 models
   - const posts
     - 各種 Controllers 方法
3. routes/posts

- 匯入 ../controllers/posts
- 在 router.method("路徑", 各種 Controllers 方法)

4.  修正 handleError, handleSuccess

---

## C. 前往 Render 建立 Web Service

1.  build and deploy from a Git repo
2.  Build Command
    `$npm install`
3.  Start Command
    `$npm start`
4.  加入環境變數
    - add from .env
    - 貼上 config.env
    - 本地端 PORT 號不用加入
5.  上傳 postman collection

---

# JWT 身份驗證機制

## A. npm

- bcrypt
- validator
- jsonwebtoken

---

## B. 修改 usersModel

- 必要欄位加入列舉

## c. 修改 config.env

- 加入 JWT_EXPIRES_DAY、JWT_SECRET
