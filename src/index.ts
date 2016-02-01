/// <reference path="../typings/main.d.ts" />
/// <reference path="./lib.d.ts" />

import {BrowserWindow} from 'electron';
import {join} from 'path';
import assign = require('object-assign');

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
        win.webContents.send('about-window:info', info);
    });
    win.setMenu(null);

    return win;
}

