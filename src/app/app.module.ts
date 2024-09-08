import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgClass } from "@angular/common";
import { SwiperModule } from "swiper/angular";
import { RouterOutlet } from "@angular/router";
import { MatterModule } from "./matter/matter.module";
import { FormsModule } from "@angular/forms";
import { FormComponent } from "./form/form.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

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
    RouterOutlet,
    MatterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [AppComponent,FormComponent],
  declarations: [AppComponent,FormComponent],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})

export class AppModule { }
