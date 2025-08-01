import * as os from 'os';

export abstract class Consts {
  static readonly APP_NAME = 'Electron Angular Quick Start';
  static readonly ENV_FILE_PATH = `${os.homedir()}/.${Consts.APP_NAME.replace(/[^A-Za-z0-9]/g, '_').toLowerCase()}/.env`;
}