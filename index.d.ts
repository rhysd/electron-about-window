/// <reference types="electron" />

export interface AboutWindowInfo {
    icon_path: string;
    product_name?: string;
    package_json_dir?: string;
    about_page_dir?: string;
    bug_report_url?: string;
    bug_link_text?: string;
    copyright?: string;
    homepage?: string;
    description?: string;
    license?: string;
    win_options?: Electron.BrowserWindowConstructorOptions;
    css_path?: string | string[];
    adjust_window_size?: boolean;
    open_devtools?: boolean;
    use_inner_html?: boolean;
    use_version_info?: boolean;
    show_close_button?: string;
    win_title?: string;
}

export default function openAboutWindow(into: AboutWindowInfo | string): Electron.BrowserWindow;
