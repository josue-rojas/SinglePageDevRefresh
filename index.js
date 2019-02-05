let http = require('http');
let fs = require('fs');
let chokidar = require('chokidar');
let socket = require('socket.io');

const PORT = process.env.PORT || 8080;
const FILEPATH = '.';
const MAIN_HTML = 'index.html';
const socketScripts = '\
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>\
<script>\
const socket = io();\
socket.on("file changed", ()=>{location.reload(); console.log("file change")})\
</script>'
var indexHTML = '';

// function takes in html string and finds the end of head (</head>) and adds socket code for refreshing page
function socketHTML(html){
  let socketEmbedHTML = '';
  let htmlLines = html.split('\n');
  for(let i = 0; i < htmlLines.length; i++){
    let line = htmlLines[i];
    let headEnd = line.search('</head>');
    if(headEnd !== -1){
      htmlLines[i] = `${line.substring(0, headEnd)} ${socketScripts} ${line.substring(headEnd)}`;
      break;
    }
  }
  return htmlLines.join('');
}

module.exports = function(){
  // initialize the html to be cached here
  indexHTML = socketHTML(fs.readFileSync(MAIN_HTML, 'utf-8'));
  // create server first
  let server = http.createServer((req, res)=>{
    if(req.url == '/'){
      res.write(indexHTML);
      res.end();
    }
    else {
      let requestFile = req.url.substring(1);
      fs.readFile(requestFile, 'utf-8',(err, data)=>{
        if(err) return console.error('Error:', err);
        // res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
      });
    }
  })
  // connect socket to server
  let io = socket(server);
  // start watching for changes
  chokidar.watch(`${FILEPATH}`, {ignored: /(^|[\/\\])\../}).on('change', (path) => {
      console.log(`Changed ${path}`);
      if(path == MAIN_HTML){
        fs.readFile(MAIN_HTML, 'utf-8', (err, data)=>{
          if(err) return console.error(('Error:', err));
          indexHTML = socketHTML(data);
          io.sockets.emit('file changed');
        })
      }
      else io.sockets.emit('file changed');
    });
  // and start server
  server.listen(PORT, (err)=>{
    if(err) return console.error('Error:', err);
    console.log(`Listening at ${PORT}`);
  });
}
