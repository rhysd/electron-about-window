'About This App' window for [Electron](https://github.com/atom/electron) apps
=============================================================================

This package provides 'About This App' window for [Electron](https://github.com/atom/electron) applications.

You can check [example app](example) to know how to use this package.  

```sh
$ git clone https://github.com/rhysd/about-window.git
$ cd about-window
$ npm run example
```

Only one function is exported as default.

```typescript
export default function openAboutWindow(
    icon_path: string,
    copyright: string,
    homepage: string,
    user_opt: BrowserWindowOptions = {}
): BrowserWindow
```

### Linux

![Linux screenshot](https://raw.githubusercontent.com/rhysd/ss/master/about-window/about-window-linux.png)

### OS X

To be added.

### Windows

![Windows screenshot](https://raw.githubusercontent.com/rhysd/ss/master/about-window/about-window-windows.jpg)

## License

[MIT License](/LICENSE.txt).

