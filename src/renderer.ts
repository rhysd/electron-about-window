import {ipcRenderer, remote, shell} from 'electron';

ipcRenderer.on('about-window:info', (_: any, info: AboutWindowInfo) => {
    const app_name = remote.app.getName();
    const open_home = () => shell.openExternal(info.homepage);
    const content = info.use_inner_html ? 'innerHTML' : 'innerText';
    document.title = `About ${app_name}`;

    const title_elem = document.querySelector('.title') as HTMLHeadingElement;
    title_elem.innerText = `${app_name} ${remote.app.getVersion()}`;
    title_elem.addEventListener('click', open_home);

    if (info.homepage) {
        document
            .querySelector('.logo')
            .addEventListener('click', open_home);
    }

    const copyright_elem = document.querySelector('.copyright') as any;
    if (info.copyright) {
        copyright_elem[content] = info.copyright;
    } else if (info.license) {
        copyright_elem[content] = `Distributed under ${info.license} license.`;
    }

    const icon_elem = document.getElementById('app-icon') as HTMLImageElement;
    icon_elem.src = info.icon_path;

    if (info.description) {
        const desc_elem = document.querySelector('.description') as any;
        desc_elem[content] = info.description;
    }

    if (info.bug_report_url) {
        const bug_report = document.querySelector('.bug-report-link') as HTMLDivElement;
        bug_report.innerText = 'found bug?';
        bug_report.addEventListener('click', e => {
            e.preventDefault();
            shell.openExternal(info.bug_report_url);
        });
    }

    if (info.css_path) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = info.css_path;
        document.head.appendChild(link);
    }

    if (info.adjust_window_size) {
        const height = document.body.scrollHeight;
        const width = document.body.scrollWidth;
        const win = remote.getCurrentWindow();
        if (height > 0 && width > 0) {
            // Note:
            // Add 30px(= about 2em) to add padding in window
            win.setContentSize(width, height + 40);
        }
    }
});

const versions = document.querySelector('.versions');
const vs = process.versions;
for (const name of ['electron', 'chrome', 'node', 'v8']) {
    const tr = document.createElement('tr');
    const name_td = document.createElement('td');
    name_td.innerText = name;
    tr.appendChild(name_td);
    const version_td = document.createElement('td');
    version_td.innerText = ' : ' + vs[name];
    tr.appendChild(version_td);
    versions.appendChild(tr);
}
