const http = require("http");
const fs = require("fs");
var config = require('./data.json');
var jsonDate = JSON.stringify(config);

console.log(jsonDate);
  
http.createServer(function(request, response){
     
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
     
    if(request.url === "/home" || request.url === "/"){
        response.write("<pre>"+jsonDate+"</pre>");
    }
    else if(request.url == "/about"){
        response.write("<h2>About</h2>");
    }
    else if(request.url == "/contact"){
        response.write("<h2>Contacts</h2>");
    }
    else{
        response.write("<h2>Not found</h2>");
    }
    response.end();
}).listen(3000);


/* fs.readFile("data.json", "utf8",
    function (error, data) {
        jsonDate = data;
        console.log("Асинхронное чтение файла");
        if (error) throw error; // если возникла ошибка
        console.log(data); // выводим считанные данные
    }); */

/* http.createServer(function (request, response) {

    response.setHeader("UserId", 12);
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    response.write("<h2>hello world</h2>");
    response.write(jsonDate);

    response.end();
}).listen(3000); */