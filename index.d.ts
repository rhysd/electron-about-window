export interface AboutWindowInfo {
    icon_path: string;
    package_json_dir?: string;
    bug_report_url?: string;
    copyright?: string;
    homepage?: string;
    description?: string;
    license?: string;
    win_options?: Electron.BrowserWindowOptions;
    css_path?: string;
    open_devtools?: boolean;
}

export default function openAboutWindow(into: AboutWindowInfo): Electron.BrowserWindow;

