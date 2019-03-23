import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SwPush } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {

    private VAPID_PUBLIC_KEY: string = "BBChwbDE1N8AcV5R1FftCBxhleb9x8HvkBhSoa3Ze7UlA2WwqrkonE9gPLgX-RMJD5fpBql59jqV_2wFOnat9bo";

    constructor(
        private swPush: SwPush,
        private http: HttpClient,
    ) {
        this.subscribeToNotifications();
    }

    subscribeToNotifications() {
        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
            .then(sub => {
                this.addPushSubscriber(sub).subscribe((result) => {
                    console.log("Subscription was succesful!");
                });
            })
            .catch(err => console.error("Could not subscribe to notifications", err));
    }

    addPushSubscriber(subscription: any) {
        return this.http.post('http://localhost:3000/notifications', subscription);
    }

}
