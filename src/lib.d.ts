/// <reference types="electron" />

interface LicenseEntry {
    type: string;
    url: string;
}

interface PackageJson {
    productName?: string;
    description?: string;
    homepage?: string;
    license?: string | LicenseEntry;
    bugs?: {
        url: string;
    };
}

interface AboutWindowInfo {
    icon_path: string;
    product_name?: string;
    copyright?: string;
    homepage?: string;
    description?: string;
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
