# singlepagedevrefresh
A node server for quick single page development using.

## About
This script is a server for single page development. It watches the project folder for changes and refreshes the browser if there is a change. This is meant for single page development with the default html being 'index.html'.

## Backstory
So I usually when I am practicing web development, more specifically design, I like to do quick one page sites. When making these one pages I think the biggest waste of time is switching to a browser and refreshing the page to see the changes. This is were this server comes in. It is meant to refresh a page when there is a change.

I tried a while back to do something without modifying the index.html but I find it a bit tedious to always have the tab at the right place (focus). You can check it [here](https://github.com/josuerojasrojas/BrowserRefresh).

### How it works
When going to http://localhost:8080 when active this adds socket.io to the page and also adds a script to refresh the page when there is a change. The backend uses chokidar to watch files and notify of changes.

### Simple Usage
```bash
# in your project folder
npm install --save-dev singlepagedevrefresh
```
Then in the package.json add to scripts
```javascript
"watch": "node -e 'require(`singlepagedevrefresh`)();'"
```
and finally run
```bash
npm run watch
```
and on your browser go to http://localhost:8080

### Parameters
This takes in an object with the following keys (all of them are optional that will fall to their default)
##### port
Integer for the port for the server - defaults to 8080
##### filePath
String for the path to watch and to serve - defaults to '.'
##### mainHTML
String of the main html (index.html) to be served and who will have socket code injected - defaults to 'index.html'
##### chokidarOptions
Object for chokidar options: [check here for more info](https://github.com/paulmillr/chokidar#api) - defaults to {ignored: /(^|[\/\\])\../}

### Some Basic examples with Parameters
```javascript
// with different port
require(`singlepagedevrefresh`)({Port: 1010});
// with different port and different path
require(`singlepagedevrefresh`)({Port: 1010, filePath: '/Users/josuerojasrojas/anotherdir'});
// ... and so on
```

#### TODO:
- hot module reload ?!?! (maybe not since this is meant to be straightforward)
- ignore custom file
- error check for readFileSync (in case file doesn't exist);
- make custom socket or make socket.io for client local. this is to develop when not online
