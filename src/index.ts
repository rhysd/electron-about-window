/// <reference path="../typings/main.d.ts" />

import {BrowserWindow} from 'electron';
import {join} from 'path';
import assign = require('object-assign');

export interface AboutWindowInfo {
    icon_path: string;
    copy_right: string;
    homepage: string;
    win_options?: Electron.BrowserWindowOptions;
}

export default function openAboutWindow(info: AboutWindowInfo) {
    'use strict';

    const index_html = 'file://' + join(__dirname, 'about.html');

    const options = assign(
        {
            width: 400,
            height: 400,
            useContentSize: true,
            titleBarStyle: 'hidden-inset',
        },
        info.win_options || {}
    );

    let win = new BrowserWindow(options);
    win.once('closed', () => {
        win = null;
    });

    win.loadURL(index_html);
    win.webContents.once('dom-ready', () => {
        win.webContents.send('about-window:info', info.icon_path, info.copy_right, info.homepage);
    });
    win.setMenu(null);

    return win;
}

