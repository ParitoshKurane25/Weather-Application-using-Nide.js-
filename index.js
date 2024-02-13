const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
    
    var temperature = tempVal
    .replace("{%temp%}", orgval.main.temp)
    .replace("{%temp_min%}", orgval.main.temp_min)
    .replace("{%tempmax%}", orgval.main.temp_max)
    .replace("{%name%}", orgval.name)
    .replace("{%country%}", orgval.sys.country)
    .replace("{%tempstatus%}", orgval.weather[0].main);

    return temperature;    
};
const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=16.7028412&lon=74.2405329&appid=6fb5cf104a761083750f7ff2cc475f2d" )
        .on("data" , (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];

            const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection clode", err);
            res.end();
        });
    }
});
server.listen(400, "127.0.0.1");

