const http = require('http');

const url = require('url');

const fs = require('fs');

const qs=require('qs');

let getTemplate = (req, res, path) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        }
    });
}

let handlers = {};
handlers.home = (req, res) => {
    getTemplate(req, res, 'views/home.html');
}
handlers.login = (req, res) => {
    if(req.method=='GET'){
        getTemplate(req, res, 'views/login.html');
    }else{
        let data='';
        req.on('data',chunk=>{
            data+=chunk;
        });
        req.on('end', () => {
            const userInfo = qs.parse(data);
            fs.readFile('./views/profile.html', 'utf8',(err, datahtml) =>{
                if (err) {
                    console.log(err);
                }
                datahtml = datahtml.replace('{name}', userInfo.name);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(datahtml);
                return res.end();
            });
        });
        req.on('error', () => {
            console.log('error')
        });
    }
}
handlers.notFound = (req, res) => {
    getTemplate(req, res, 'views/not-found.html');
}

let router = {
    'register': handlers.register,
    'login': handlers.login,
    '': handlers.home
}

http.createServer((req,res)=>{
    let urlParse=url.parse(req.url,true);
    let path=urlParse.pathname;
    let trimPath=path.replace(/^\/+|\/+$/g, '');
    let chosenHandler;
    if(typeof router[trimPath]==='undefined'){
        chosenHandler=handlers.notFound;
    }else{
        chosenHandler=router[trimPath];
    }
    chosenHandler(req, res);

}).listen(3000, () => {
    console.log('localhost3000');
})
