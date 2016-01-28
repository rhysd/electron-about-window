import {BrowserWindow, app, ipcMain} from 'electron';
import {join} from 'path';
import assign = require('object-assign');

export default function openAboutWindow(icon_path: string, copyright: string, homepage: string, user_opt: Electron.BrowserWindowOptions = {}) {
    const index_html = 'file://' + join(__dirname, 'about.html');

    const options = assign({
        width: 400,
        height: 400,
        useContentSize: true,
        titleBarStyle: 'hidden-inset',
    }, user_opt);

    let win = new BrowserWindow(options);
    win.once('closed', () => {
        win = null;
    });

    win.loadURL(index_html);
    win.webContents.once('dom-ready', () => {
        win.webContents.send('about-window:info', icon_path, copyright, homepage);
    });
    win.setMenu(null);

    return win;
}

