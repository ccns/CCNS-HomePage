MongoDB伺服器的port : 27017
搜尋頁面伺服器的port : 8080
ajax伺服器的port : 8080

執行程式的順序
1. 執行爬蟲
2. 執行tagger
3. 開啟DB server
4. 執行JSON-To-DB
5. 執行node server

{
    "Mode":"Develop" or "Deploy"
    "DB-Host-URL":"mongodb://localhost:27017/Events-Mongo-Database",

}
