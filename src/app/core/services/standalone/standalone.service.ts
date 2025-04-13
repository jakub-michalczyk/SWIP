import { DestroyRef, inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StandaloneService {
  private isStandaloneSubject = new BehaviorSubject<boolean>(this.checkIfPwa());
  private renderer: Renderer2;
  private installEventSubject = new BehaviorSubject<BeforeInstallPromptEvent | null>(null);
  private destroyerRef = inject(DestroyRef);

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.checkIfPwa();
    this.addBodyClass();
    this.setUpPromptEvent();
  }

  private setUpPromptEvent() {
    fromEvent<BeforeInstallPromptEvent>(window, 'beforeinstallprompt').subscribe((event) => {
      event.preventDefault();
      this.installEventSubject.next(event);
    });
  }

  private checkIfPwa() {
    const mqStandAlone = '(display-mode: standalone)';
    const isStandalone = window.matchMedia(mqStandAlone).matches;

    return isStandalone;
  }

  private addBodyClass() {
    this.isStandaloneMode$
      .pipe(take(1), takeUntilDestroyed(this.destroyerRef))
      .subscribe((mode) =>
        mode ? this.renderer.addClass(document.body, 'pwa') : this.renderer.removeClass(document.body, 'pwa')
      );
  }

  installApp() {
    const installEvent = this.installEventSubject.getValue();
    if (installEvent) {
      installEvent.prompt();
      this.installEventSubject.next(null);
    }
  }

  get isStandaloneMode$() {
    return this.isStandaloneSubject.asObservable();
  }
}
