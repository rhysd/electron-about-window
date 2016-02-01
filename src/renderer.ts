/// <reference path="../typings/browser.d.ts" />
/// <reference path="./lib.d.ts" />

import {shell, ipcRenderer, remote} from 'electron';

ipcRenderer.on('about-window:info', (_, info: AboutWindowInfo) => {
    document
        .querySelector('.logo')
        .addEventListener('click', () => shell.openExternal(info.homepage));
    const name = remote.app.getName();
    document.title = 'About ' + name;
    const title_elem = document.querySelector('.title') as HTMLDivElement;
    title_elem.innerText = `About ${name} ${remote.app.getVersion()}`;
    const copyright_elem = document.querySelector('.copyright') as HTMLDivElement;
    copyright_elem.innerText = info.copyright;
    const icon_elem = document.getElementById('app-icon') as HTMLImageElement;
    icon_elem.src = info.icon_path;
});

const versions = document.querySelector('.versions');
const vs = process.versions;
for (let name of ['electron', 'chrome', 'node', 'v8']) {
    const tr = document.createElement('tr');
    const name_td = document.createElement('td');
    name_td.innerText = name;
    tr.appendChild(name_td);
    const version_td = document.createElement('td');
    version_td.innerText = ' : ' + vs[name];
    tr.appendChild(version_td);
    versions.appendChild(tr);
}
