var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow;
var openAboutWindow = require('..').default;
var join = require('path').join;

app.once('window-all-closed',function() { app.quit(); });

app.once('ready', function() {
    var w = new BrowserWindow();
    w.once('closed', function() { w = null; });
    w.loadURL('file://' + join(__dirname, 'index.html'));

    const menu = Menu.buildFromTemplate([
        {
            label: 'Example',
            submenu: [
                {
                    label: 'About This App',
                    click: () => {
                        const win = openAboutWindow(
                            {
                                icon_path: join(__dirname, 'icon.png'),
                                copyright: 'Copyright (c) 2015 rhysd',
                                package_json_dir: __dirname
                            }
                        );
                        win.webContents.openDevTools({detach: true});
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
});
