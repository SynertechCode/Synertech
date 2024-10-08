import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgClass } from "@angular/common";
import { SwiperModule } from "swiper/angular";
import { RouterModule, RouterOutlet } from "@angular/router";  // Додано RouterModule
import { MatterModule } from "./matter/matter.module";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { UsersComponent } from './users/users.component';
import { MainComponent } from './main/main.component';
import { FormComponent } from './form/form.component';
import { routes } from './app.routes';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 3
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [
    BrowserModule,
    NgClass,
    SwiperModule,
    RouterModule.forRoot(routes), // Додано для маршрутизації
    MatterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  declarations: [AppComponent, FormComponent, UsersComponent, MainComponent],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule { }
