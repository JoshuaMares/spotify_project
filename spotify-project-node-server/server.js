const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res) => {
    const num = _.random(0,20);
    console.log(num);

    const greet =  _.once(() => {
        console.log('only want to run once ever');
    });

    greet();
    greet();
    
    //callback runs everytime a request comes  in
    //request and response object
    console.log(req.url, req.method);
    res.setHeader('Content-Type', 'text/html');
    let path = './views_old/';
    switch(req.url){
        case '/':
            path += 'index.html';
            res.statusCode = 200;//code means things went as planned
            break;
        case '/about':
            path += 'about.html';
            res.statusCode = 200;
            break;
        case '/about-me':
            res.statusCode = 301;//code means the page has been moved and we are redirecting
            res.setHeader('Location', '/about');
            res.end();
            //here we just use the header object to tell the page to redirect and reload
            break;
        default:
            path+= '404.html';
            res.statusCode = 404;
            break;
    }

    fs.readFile(path, (err, data) => {
        if(err){
            console.log(err);
        }else{
            //res.write(data);
            res.end(data);
            console.log('response sent'); 
        }
    });
});

server.listen(3000, 'localhost', ()=>{
    console.log('listening to requests on port 3000');
});