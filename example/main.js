const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const join = require('path').join;

// Replace '..' with 'about-window'
const openAboutWindow = require('..').default;

app.once('window-all-closed', function() {
    app.quit();
});

app.once('ready', function() {
    let w = new BrowserWindow();
    w.once('closed', function() {
        w = null;
    });
    w.loadURL('file://' + join(__dirname, 'index.html'));

    const options = {
        icon_path: join(__dirname, 'icon.png'),
        copyright: 'Copyright (c) 2015 rhysd',
        package_json_dir: __dirname,
        win_options: {
            resizable: false,
            minimizable: false,
            maximizable: false,
            movable: false,
            parent: w,
            modal: true,
        }
    }

    const menu = Menu.buildFromTemplate([
        {
            label: 'Example',
            submenu: [
                {
                    label: 'About This App',
                    click: () =>
                        openAboutWindow({
                            icon_path: join(__dirname, 'icon.png'),
                            copyright: 'Copyright (c) 2015 rhysd',
                            package_json_dir: __dirname,
                            open_devtools: process.env.NODE_ENV !== 'production',
                        }),
                },
                {
                    label: 'About This App (modal with close)',
                    click: () =>
                        openAboutWindow({
                            icon_path: join(__dirname, 'icon.png'),
                            copyright: 'Copyright (c) 2015 rhysd',
                            package_json_dir: __dirname,
                            win_options: {
                                parent: w,
                                modal: true,
                            },
                            show_close_button: "Close"
                        }),
                },
                {
                    label: 'About This App (modal with options)',
                    click: () =>
                        openAboutWindow(options),
                },
            ],
        },
    ]);
    Menu.setApplicationMenu(menu);
});
