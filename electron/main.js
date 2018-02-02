const { app, BrowserWindow, Menu, shell } = require('electron'),
    path = require('path'),
    url = require('url');

const setApplicationMenu = () => {
    const template = [
        {
            label: 'File',
            submenu: [
                { label: 'Import...', tag: 'import', click: menuItemClick },
                { label: 'Export...', tag: 'export', click: menuItemClick },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        { role: 'editMenu' },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'toggledevtools', label: 'Show DevTools' }
            ]
        },
        { role: 'windowMenu' },
        { 
            label: 'Help',
            submenu: [
                { label: 'About', tag: 'about', click: menuItemClick }
            ]
        }
    ];

    Menu.setApplicationMenu( Menu.buildFromTemplate(template) );
};

const menuItemClick = (item, browserWindow, event) => {
    switch (item.tag) {
        case 'import':
        case 'export':
            browserWindow.webContents.send('app-menu-click', item.tag);
            break;
        case 'about':
            shell.openExternal('https://github.com/taras-d/my-words#my-words');
            break;
    }
};

const createWindow = () => {
    const win = new BrowserWindow({ 
        width: 800, 
        height: 600,
        minWidth: 800,
        minHeight: 600
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));
};

app.on('ready', () => {
    setApplicationMenu();
    createWindow();
});