import { bootstrapApplication } from '@angular/platform-browser';
import { SwipComponent } from './app/swip.component';
import { appConfig } from './app/swip.config';

bootstrapApplication(SwipComponent, appConfig).catch((err) => console.error(err));
