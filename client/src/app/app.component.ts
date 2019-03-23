import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from "@angular/service-worker";
import { PushNotificationService } from './services/notifications/push-notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private swUpdate: SwUpdate,
        private asd: PushNotificationService
    ) { }

    ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm("New version available. Load New Version?")) {
                    window.location.reload();
                }
            });
        }
    }
}
