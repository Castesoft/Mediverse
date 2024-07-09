import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent, appConfig } from 'src/app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
