const { app, BrowserWindow } = require('electron'),
    path = require('path'),
    url = require('url');

app.on('ready', () => {
    const win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));
});