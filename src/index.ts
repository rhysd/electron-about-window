/// <reference path="../typings/main.d.ts" />
/// <reference path="./lib.d.ts" />

import {BrowserWindow} from 'electron';
import {join} from 'path';
import assign = require('object-assign');

function injectInfoFromPackageJson(info: AboutWindowInfo) {
    'use strict';

    if (!info.package_json_dir) {
        return info;
    }

    let pkg: PackageJson;
    try {
        pkg = require(join(info.package_json_dir, 'package.json'));
    } catch (e) {
        return info;
    }

    if (!info.description) {
        info.description = pkg.description;
    }
    if (!info.license && pkg.license) {
        const l = pkg.license;
        info.license = typeof l === 'string' ? l : l.type;
    }
    if (!info.homepage) {
        info.homepage = pkg.homepage;
    }
    if (!info.bug_report_url && typeof(pkg.bugs) === 'object') {
        info.bug_report_url = pkg.bugs.url;
    }

    return info;
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
        delete info.win_options;
        win.webContents.send('about-window:info', info);
    });
    win.setMenu(null);

    info = injectInfoFromPackageJson(info);

    return win;
}

