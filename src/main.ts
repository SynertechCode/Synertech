import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'intersection-observer';


// bootstrapApplication(AppComponent)
//   .catch((err) => console.error(err));


const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule).then(() => {
});
