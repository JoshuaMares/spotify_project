const http = require('http');

const server = http.createServer((req, resp) => {
    //callback runs everytime a request comes  in
    //request and response object
    console.log('request made');
});

server.listen(3000, 'localhost', ()=>{
    console.log('listening to requests on port 3000');
});