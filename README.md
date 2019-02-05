# SinglePageDevRefresh
A node server for quick single page development using.

## About
This script is a server for single page development. It watches the project folder for changes and refreshes the browser if there is a change. This is meant for single page development with the default html being 'index.html'.

## Backstory
So I usually when I am practicing web development, more specifically design, I like to do quick one page sites. When making these one pages I think the biggest waste of time is switching to a browser and refreshing the page to see the changes. This is were this server comes in. It is meant to refresh a page when there is a change.

I tried a while back to do something without modifying the index.html but I find it a bit tedious to always have the tab at the right place (focus). You can check it [here](https://github.com/josuerojasrojas/BrowserRefresh).

### How it works
When going to http://localhost:8080 when active this adds socket.io to the page and also adds a script to refresh the page when there is a change. The backend uses chokidar to watch files and notify of changes.

### Usage
```bash
# in your project folder
npm install --save-dev git+https://github.com/josuerojasrojas/SinglePageDevRefresh
```
Then in the package.json add to scripts
```javascript
"watch": "node -e 'require(`SinglePageDevRefresh`)();'"
```
and finally run
```bash
npm run watch
```
and on your browser go to http://localhost:8080

NOTE: There are still some things I need to add, like options for port, files to watch, etc. For now the defaults are Port=8080, and project folder is the one to watch.

#### TODO:
- hot module reload ?!?! (maybe not since this is meant to be straightforward)
- ignore custom file
- watch custom path
- parameters should be added
  - PORT
  - FILEPATH
  - MAIN_HTML
- error check for readFileSync (in case file doesn't exist);
