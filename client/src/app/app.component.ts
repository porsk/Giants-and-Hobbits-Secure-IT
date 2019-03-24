import { Component } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";
import { Router } from '@angular/router';
import { PushNotificationService } from './services/notifications/push-notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private swUpdate: SwUpdate,
        public router: Router,
        public notificationService: PushNotificationService
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
