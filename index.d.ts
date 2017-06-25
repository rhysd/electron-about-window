/// <reference types="electron" />

export interface AboutWindowInfo {
    icon_path: string;
    package_json_dir?: string;
    bug_report_url?: string;
    copyright?: string;
    homepage?: string;
    description?: string;
    license?: string;
    win_options?: Electron.BrowserWindowConstructorOptions;
    css_path?: string;
    adjust_window_size?: boolean;
    open_devtools?: boolean;
    use_inner_html?: boolean;
}

export default function openAboutWindow(into: AboutWindowInfo): Electron.BrowserWindow;
