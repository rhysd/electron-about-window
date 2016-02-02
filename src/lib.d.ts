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
    copyright?: string;
    homepage?: string;
    description?: string;
    package_json_dir?: string;
    license?: string;
    bug_report_url?: string;
    win_options?: Electron.BrowserWindowOptions;
    css_path?: string;
    open_devtools?: boolean;
}

