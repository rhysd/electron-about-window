export interface AboutWindowInfo {
    icon_path: string;
    copy_right: string;
    homepage: string;
    win_options?: Electron.BrowserWindowOptions;
}

export default function openAboutWindow(into: ABoutWindowInfo): Electron.BrowserWindow;

