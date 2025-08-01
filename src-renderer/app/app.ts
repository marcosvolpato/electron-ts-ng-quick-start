import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventManagerService } from './services/event-manager.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor(
    private eventManagerService: EventManagerService,
  ) {}
  
  teste() {
    const payload = {
      data: {
        message: 'Hello from renderer process',
      }
    };

    this.eventManagerService.createEvent('TestExecutor', payload).pipe(
      tap(res => {
        console.log('Response from main process TestExecutor:', res);
      }),
      catchError(err => {
        console.error('Error in event:', err);
        return of(null);
      }),
    ).subscribe();
  }
}
