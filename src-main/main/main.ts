import { app, BrowserWindow } from 'electron';


class Main {
  public static run() {
    app.whenReady().then(this.createWindow);
  }

  private static createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    win.loadFile('dist/renderer-content/browser/index.html');
    // win.webContents.openDevTools();
  }
}
Main.run();
