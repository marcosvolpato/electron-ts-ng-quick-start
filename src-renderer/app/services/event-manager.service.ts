import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable, of } from 'rxjs';
import { IPCEvent } from '../../../src-shared/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {
  private ipc: IpcRenderer;

  constructor(
    private ngZone: NgZone,
  ) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        console.error('Error accessing ipcRenderer:', error);
        throw error;
      }
    } else {
      console.warn('Electron IPC not available. Ensure you are running in an Electron environment.');
    }
  }

  createEvent(eventToken: string, reqData?: IPCEvent): Observable<{data: any}> {
    return this.createObservable(eventToken, reqData );
  }

  private createObservable(eventToken: string, reqData?: IPCEvent): Observable<{data: any}> {
    if (!this.ipc) {
      console.warn('IPC not available');
      return of({data: null})
    }
    return new Observable(observer => {
      let watchId: number = 0;

      this.ipc.on(`${eventToken}${reqData && reqData.reqId ? '-' + reqData.reqId : ''}-from-main`, (event, result) => {
        this.ngZone.run(() => {
          observer.next(result);
          observer.complete();
        });
      });

      this.ipc.send(`${eventToken}-to-main`, reqData);

      return {
        unsubscribe() {
          if (watchId) {
            navigator.geolocation.clearWatch(watchId);
          }
        }
      }
    });
  }
}
