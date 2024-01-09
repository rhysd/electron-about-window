import { app as appMain, BrowserWindow as BrowserWindowMain, shell, ipcMain } from 'electron';
import { statSync } from 'fs';
import * as path from 'path';

export interface LicenseEntry {
    type: string;
    url: string;
}

export interface PackageJson {
    productName?: string;
    description?: string;
    homepage?: string;
    license?: string | LicenseEntry;
    bugs?: {
        url: string;
    };
}

export interface AboutWindowInfo {
    icon_path: string;
    product_name?: string;
    copyright?: string;
    homepage?: string;
    description?: string;
    // if this param is present, we ignore package_json_dir param.
    package_json?: PackageJson;
    package_json_dir?: string;
    about_page_dir?: string;
    license?: string;
    bug_report_url?: string;
    css_path?: string | string[];
    adjust_window_size?: boolean;
    win_options?: Electron.BrowserWindowConstructorOptions;
    open_devtools?: boolean;
    use_inner_html?: boolean;
    bug_link_text?: string;
    use_version_info?: boolean | [string, string][];
    show_close_button?: string;
    app?: Electron.App;
    BrowserWindow?: typeof Electron.BrowserWindow;
    ipcMain?: Electron.IpcMain;
}

declare namespace NodeJS {
    interface ProcessVersions {
        [name: string]: string;
    }
}

function loadPackageJson(pkg_path: string): PackageJson {
    try {
        // some build systems(vite, rollup) may not be able to transform this line into a valid es module statement.
        // in this case, even the user pass in the right folder, it will throw an error when load the json.
        // even worse, the error will be caught and handled here, which make it hard to debug.
        return require(pkg_path);
    } catch (e) {
        console.warn(e);
        return null;
    }
}

function detectPackageJson(specified_dir: string, app: Electron.App) {
    if (specified_dir) {
        const pkg = loadPackageJson(path.join(specified_dir, 'package.json'));
        if (pkg !== null) {
            return pkg;
        } else {
            console.warn('about-window: package.json is not found in specified directory path: ' + specified_dir);
        }
    }

    // Note: app.getName() was replaced with app.name at Electron v7
    const app_name = app.name || app.getName();

    for (const mod_path of (module as any).paths) {
        if (!path.isAbsolute(mod_path)) {
            continue;
        }

        const p = path.join(mod_path, '..', 'package.json');
        try {
            const stats = statSync(p);
            if (stats.isFile()) {
                const pkg = loadPackageJson(p);
                if (pkg !== null && pkg.productName === app_name) {
                    return pkg;
                }
            }
        } catch (e) {
            // File not found.  Ignored.
        }
    }

    // Note: Not found.
    return null;
}

function injectInfoFromPackageJson(info: AboutWindowInfo, app: Electron.App) {
    let pkg: PackageJson | null | undefined;
    if (info.package_json) {
        pkg = info.package_json;
    } else {
        pkg = detectPackageJson(info.package_json_dir, app);
    }
    if (pkg == null) {
        // Note: Give up.
        return info;
    }

    if (!info.product_name) {
        info.product_name = pkg.productName;
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
    if (!info.bug_report_url && typeof pkg.bugs === 'object') {
        info.bug_report_url = pkg.bugs.url;
    }
    if (info.use_inner_html === undefined) {
        info.use_inner_html = false;
    }
    if (info.use_version_info === undefined) {
        info.use_version_info = true;
    }

    return info;
}

function normalizeParam(info_or_img_path: AboutWindowInfo | string | undefined | null): AboutWindowInfo {
    if (!info_or_img_path) {
        throw new Error(
            'First parameter of openAboutWindow() must not be empty. Please see the document: https://github.com/rhysd/electron-about-window/blob/master/README.md',
        );
    }

    if (typeof info_or_img_path === 'string') {
        return { icon_path: info_or_img_path };
    } else {
        const info = info_or_img_path;
        if (!info.icon_path) {
            throw new Error(
                "First parameter of openAboutWindow() must have key 'icon_path'. Please see the document: https://github.com/rhysd/electron-about-window/blob/master/README.md",
            );
        }
        return { ...info };
    }
}

export default function openAboutWindow(info_or_img_path: AboutWindowInfo | string) {
    let window: Electron.BrowserWindow = null;
    let info = normalizeParam(info_or_img_path);

    const ipc = ipcMain ?? info.ipcMain;
    const app = appMain ?? info.app;
    const BrowserWindow = BrowserWindowMain ?? info.BrowserWindow;
    if (!app || !BrowserWindow || !ipc) {
        throw new Error(
            "openAboutWindow() is called on non-main process. Set 'app', 'BrowserWindow' and 'ipcMain' properties in the 'info' argument of the function call",
        );
    }

    if (window !== null) {
        window.focus();
        return window;
    }

    let base_path = info.about_page_dir;

    if (base_path === undefined || base_path === null || !base_path.length) {
        base_path = path.join(__dirname, '..');
    }

    const index_html = 'file://' + path.join(base_path, 'about.html');

    const options = Object.assign(
        {
            width: 400,
            height: 400,
            useContentSize: true,
            titleBarStyle: 'hidden-inset',
            show: !info.adjust_window_size,
            icon: info.icon_path,
            webPreferences: {
                // For security reasons, nodeIntegration is no longer true by default when using Electron v5 or later
                // nodeIntegration can be safely enabled as long as the window source is not remote
                nodeIntegration: true,
                // From Electron v12, this option is set to true by default
                contextIsolation: false,
            },
        },
        info.win_options || {},
    );

    window = new BrowserWindow(options);

    const on_win_adjust_req = (_: unknown, width: number, height: number, show_close_button: boolean) => {
        if (height > 0 && width > 0) {
            // Note:
            // Add 30px(= about 2em) to add padding in window, if there is a close button, bit more
            if (show_close_button) {
                window.setContentSize(width, height + 40);
            } else {
                window.setContentSize(width, height + 52);
            }
        }
    };
    const on_win_close_req = () => {
        window.close();
    };
    ipc.on('about-window:adjust-window-size', on_win_adjust_req);
    ipc.on('about-window:close-window', on_win_close_req);

    window.once('closed', () => {
        window = null;
        ipc.removeListener('about-window:adjust-window-size', on_win_adjust_req);
        ipc.removeListener('about-window:close-window', on_win_close_req);
    });
    window.loadURL(index_html);

    window.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });
    window.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });

    window.webContents.once('dom-ready', () => {
        const win_title = info.win_options ? info.win_options.title : null;
        delete info.win_options;
        info.win_options = { title: win_title };
        const app_name = info.product_name || app.name || app.getName();
        const version = app.getVersion();
        window.webContents.send('about-window:info', info, app_name, version);
        if (info.open_devtools) {
            if (process.versions.electron >= '1.4') {
                window.webContents.openDevTools({ mode: 'detach' });
            } else {
                window.webContents.openDevTools();
            }
        }
    });

    window.once('ready-to-show', () => {
        window.show();
    });

    window.setMenu(null);

    info = injectInfoFromPackageJson(info, app);

    return window;
}
