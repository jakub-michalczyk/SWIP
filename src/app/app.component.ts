import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { fromEvent } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [ServiceWorkerModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private installEvent: any;

  ngOnInit() {
    this.registerServiceWorker();
    this.setUpPWASub();
  }

  registerServiceWorker() {
    if (environment.production) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('ngsw-worker.js')
          .then((registration) => {
            console.log('Service Worker registered', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration error', error);
          });
      }
    }
  }

  setUpPWASub() {
    const installPrompt$ = fromEvent<BeforeInstallPromptEvent>(
      window,
      'beforeinstallprompt'
    );

    installPrompt$.subscribe((event) => {
      this.installEvent = event; // Catch event
    });
  }

  installApp() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent = null;
    }
  }
}
