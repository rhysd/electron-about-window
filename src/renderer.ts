import { ipcRenderer, remote, shell } from 'electron';

ipcRenderer.on('about-window:info', (_: any, info: AboutWindowInfo) => {
    // Note: app.getName() was replaced with app.name at Electron v7
    const app_name = info.product_name || remote.app.name || remote.app.getName();
    const open_home = () => shell.openExternal(info.homepage);
    const content = info.use_inner_html ? 'innerHTML' : 'innerText';
    document.title = info.win_options.title || `About ${app_name}`;

    const title_elem = document.querySelector('.title') as HTMLHeadingElement;
    title_elem.innerText = `${app_name} ${remote.app.getVersion()}`;

    if (info.homepage) {
        title_elem.addEventListener('click', open_home);
        title_elem.classList.add('clickable');
        const logo_elem = document.querySelector('.logo');
        logo_elem.addEventListener('click', open_home);
        logo_elem.classList.add('clickable');
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
        bug_report.innerText = info.bug_link_text || 'Report an issue';
        bug_report.addEventListener('click', e => {
            e.preventDefault();
            shell.openExternal(info.bug_report_url);
        });
    }

    if (info.css_path) {
        const css_paths = !Array.isArray(info.css_path) ? [info.css_path] : info.css_path;
        for (const css_path of css_paths) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = css_path;
            document.head.appendChild(link);
        }
    }

    if (info.adjust_window_size) {
        const height = document.body.scrollHeight;
        const width = document.body.scrollWidth;
        const win = remote.getCurrentWindow();
        if (height > 0 && width > 0) {
            // Note:
            // Add 30px(= about 2em) to add padding in window, if there is a close button, bit more
            if (info.show_close_button) {
                win.setContentSize(width, height + 40);
            } else {
                win.setContentSize(width, height + 52);
            }
        }
    }

    if (info.use_version_info) {
        const versions = document.querySelector('.versions');
        const version_info: Array<[string, string]> = Array.isArray(info.use_version_info)
            ? info.use_version_info
            : ['electron', 'chrome', 'node', 'v8'].map(e => [e, process.versions[e]]);
        for (const [name, value] of version_info) {
            const tr = document.createElement('tr');
            const name_td = document.createElement('td');
            name_td.innerText = name;
            tr.appendChild(name_td);
            const version_td = document.createElement('td');
            version_td.innerText = ' : ' + value;
            tr.appendChild(version_td);
            versions.appendChild(tr);
        }
    }

    if (info.show_close_button) {
        const buttons = document.querySelector('.buttons');
        const close_button = document.createElement('button');
        close_button.innerText = info.show_close_button;
        close_button.addEventListener('click', e => {
            e.preventDefault();
            remote.getCurrentWindow().close();
        });
        buttons.appendChild(close_button);
        close_button.focus();
    }
});
