const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');

let win; 

function createWindow(argument) {
    win = new BrowserWindow({
        width: 1024,
        height: 728,
        minWidth: 600, 
        minHeight: 300, 
        icon: __dirname + "/img/icon.png",
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed',() => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
    app.quit();
});

