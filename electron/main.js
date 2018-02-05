const { app, BrowserWindow, Menu, shell } = require('electron');

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
            browserWindow.webContents.send('import');
            break;

        case 'export':
            browserWindow.webContents.send('export');
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
        minHeight: 600,
        show: false
    });
    win.loadURL(`file://${__dirname}/../dist/index.html`);
    win.on('ready-to-show', () => win.show());
};

app.on('ready', () => {
    setApplicationMenu();
    createWindow();
});