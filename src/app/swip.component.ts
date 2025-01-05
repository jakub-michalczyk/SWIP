import { Component, OnInit } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { fromEvent } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TopbarComponent } from './core/components/topbar/topbar.component';

@Component({
  selector: 'swip-root',
  imports: [ServiceWorkerModule, MatButtonModule, TopbarComponent],
  templateUrl: './swip.component.html',
})
export class SwipComponent implements OnInit {
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
