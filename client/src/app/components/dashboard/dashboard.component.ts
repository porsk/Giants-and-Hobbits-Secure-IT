import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";
import { PushNotificationService } from '../../services/notifications/push-notification.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  public homeConfig: any;

  constructor(
      public http: HttpService,
      public notificationService: PushNotificationService
  ) {}

  ngOnInit() {
    this.http.getSensorData().subscribe(result => {
      this.homeConfig = result;
    });

    this.notificationService.alertNotification.subscribe((result) => {
        if (result) {
            this.http.getSensorData().subscribe(result => {
                this.homeConfig = result;
            });
        }
    });
  }

  updateOnAlertClose(type: string) {
      this.http.setAlert(type)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateFlameSensor(event: any) {
      this.homeConfig.flameSensor = event.checked;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateImHomeSimulationSensor(event: any) {
      this.homeConfig.imHomeSimulation = event.checked;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateMethaneSensor(event: any) {
      this.homeConfig.methaneSensor = event.checked;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateMotionSensor(event: any) {
      this.homeConfig.motionSensor = event.checked;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }
}
