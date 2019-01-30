let http = require('http');
let fs = require('fs');
let chokidar = require('chokidar');
let socket = require('socket.io');

const PORT = process.env.PORT || 8080;
const FILEPATH = '.';
const FILE = 'index.html';
const socketScripts = '\
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>\
<script>\
const socket = io();\
socket.on("file changed", ()=>{location.reload(); console.log("file change")})\
</script>'

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

let server = http.createServer((req, res)=>{
  let requestFile = FILE;
  if(req.url != '/'){
    requestFile = req.url.substring(1);
  }
  fs.readFile(requestFile, 'utf-8',(err, data)=>{
    if(err) return console.error('Error:', err);
    if(req.url == '/'){
      data = socketHTML(data);
    }
    // res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
})

let io = socket(server);

io.on('connection', (socket)=>{
  socket.on('disconnect', ()=>{ console.log('disconnected') })
  console.log('connected')
});

chokidar.watch(`${FILEPATH}`, {ignored: /(^|[\/\\])\../}).on('change', (path) => {
    console.log(`Changed ${path}`);
    io.sockets.emit('file changed');
  });

server.listen(PORT, (err)=>{
  if(err) return console.error('Error:', err);
  console.log(`Listening at ${PORT}`);
});
