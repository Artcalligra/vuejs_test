const http = require("http");
const fs = require("fs");

http.createServer(function (request, response) {
    const filePath = request.url.substr(1);
    fs.readFile(filePath, function (error, data) {

        if (error) {
            response.setHeader('Content-Type', 'text/html');
            response.statusCode = 404;
            response.end("Resourse not found!");
        } else {
            response.setHeader('Content-Type', 'application/json');
            response.end(data);
        }
    });
}).listen(3000, function () {
    console.log("Server started at 3000");
});