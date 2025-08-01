require('source-map-support').install();
import 'reflect-metadata';
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen } from 'electron';
import { ExecutorResolver } from '../executors/executor.resolver';
import * as dotenv from 'dotenv';
import { Consts } from '../utils/consts.util';
import * as fs from 'fs';
import { IPCEvent } from '../models/common.model';


class Main {
  private executorResolver = new ExecutorResolver();
  private serve: boolean = false;

  constructor() {
    this.serve = this.isServeMode();
    if (this.serve) {
      // Load environment variables from .env file in development mode(in root directory)
      dotenv.config();
    } else {
      // Load environment variables from .env file in production mode(in user home directory)
      if (fs.existsSync(Consts.ENV_FILE_PATH)) {
        dotenv.config({ path: Consts.ENV_FILE_PATH });
      } else {
        console.warn(`Production environment file not found at ${Consts.ENV_FILE_PATH.replace(/\//g, '\\')}.`);
      }
    }
  }

  public run() {
    app.whenReady().then(() => {
      this.createWindow();

      for (const token of this.executorResolver.getExecutorsTokens()) {
        this.createEvent(token, (request: IPCEvent, onFinish) => {
          const executor = this.executorResolver.resolve(token);
          executor.execute(request, onFinish);
        });
      }
    });
  }

  private createWindow() {
    // basic window options
    const winOptions: BrowserWindowConstructorOptions = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    }

    // Config the window to open on the external display if USE_EXTERNAL_DISPLAY var is set to true
    if ((process.env.USE_EXTERNAL_DISPLAY || 'false').toLowerCase() === 'true') {
      let displays = screen.getAllDisplays();
      let externalDisplay = displays.find((display) => {
          return display.bounds.x !== 0 || display.bounds.y !== 0;
      });
      if (externalDisplay) {
        winOptions['x'] = externalDisplay.bounds.x + 50;
        winOptions['y'] = externalDisplay.bounds.y + 50;
      }
    }
    
    // Create the browser window
    const win = new BrowserWindow(winOptions);

    if (this.serve) {
      try {
        // Enable hot reloading in serve mode
        require('electron-reloader')(module);
      } catch (error) {
        console.warn('Error reloading Electron:', error);
      }
      // Load the renderer source from url (only in serve mode)
      win.loadURL("http://localhost:4200/");
    } else {
      // Load the index.html of the app (only in production mode)
      win.loadFile('dist/renderer-content/browser/index.html');
    }

    // set maximize and open dev tools
    win.maximize();
    win.webContents.openDevTools();
  }

  private createEvent(eventToken: string, execFn: (request: IPCEvent, onFinish: (data: IPCEvent) => void) => void) {
    ipcMain.on(`${eventToken}-to-main`, async (event, reqData: IPCEvent) => {
      execFn(reqData, data => {
        event.sender.send(`${eventToken}${reqData && reqData.reqId ? '-' + reqData.reqId : ''}-from-main`, data);
      });
    });
  }

  /**
   * 
   * @returns true if the application is running in serve mode (--serve flag), false if in production mode
   */
  private isServeMode(): boolean {
    const args = process.argv.slice(1);
    return args.some(val => val === '--serve');
  }
}

const main = new Main();
main.run();
