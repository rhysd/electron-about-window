export interface AboutWindowInfo {
    icon_path: string;
    copyright?: string;
    homepage?: string;
    description?: string;
    package_json_dir?: string;
    license?: string;
    bug_report_url?: string;
    win_options?: Electron.BrowserWindowOptions;
}

export default function openAboutWindow(into: AboutWindowInfo): Electron.BrowserWindow;

