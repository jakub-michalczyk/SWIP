import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/swip.config';
import { SwipComponent } from './app/swip.component';

bootstrapApplication(SwipComponent, appConfig).catch((err) =>
  console.error(err)
);
