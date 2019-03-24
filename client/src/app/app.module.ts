import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { PushNotificationService } from "./services/notifications/push-notification.service";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { environment } from "../environments/environment";
import { HttpService } from "./services/http/http.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EntryListComponent } from './components/entry-list/entry-list.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, EntryListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    MatSlideToggleModule,

    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    BrowserAnimationsModule
  ],
  providers: [PushNotificationService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {}
