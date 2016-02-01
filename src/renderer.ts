/// <reference path="../typings/browser.d.ts" />
/// <reference path="./lib.d.ts" />

import {shell, ipcRenderer, remote} from 'electron';

ipcRenderer.on('about-window:info', (_, info: AboutWindowInfo) => {
    document
        .querySelector('.logo')
        .addEventListener('click', () => shell.openExternal(info.homepage));

    const app_name = remote.app.getName();
    document.title = `About ${app_name}`;

    const title_elem = document.querySelector('.title') as HTMLHeadingElement;
    title_elem.innerText = `${app_name} ${remote.app.getVersion()}`;

    const copyright_elem = document.querySelector('.copyright') as HTMLDivElement;
    copyright_elem.innerText = info.copyright;

    const icon_elem = document.getElementById('app-icon') as HTMLImageElement;
    icon_elem.src = info.icon_path;

    console.log(info);
    if (info.description) {
        const desc_elem = document.querySelector('.description') as HTMLHeadingElement;
        desc_elem.innerText = info.description;
    }
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
