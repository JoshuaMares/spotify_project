const http = require('http');

const server = http.createServer((req, res) => {
    //callback runs everytime a request comes  in
    //request and response object
    console.log('request made');
    console.log(req.url, req.method);
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>hello, spotify users</p>');
    res.end();
});

server.listen(3000, 'localhost', ()=>{
    console.log('listening to requests on port 3000');
});