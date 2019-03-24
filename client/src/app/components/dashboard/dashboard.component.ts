import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";
import { PushNotificationService } from '../../services/notifications/push-notification.service';
import { timer } from 'rxjs';

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

    setTimeout(() => this.timer(), 1000);
  }

  timer() {
      this.http.getSensorData().subscribe(result => {
        this.homeConfig = result;
        setTimeout(() => this.timer(), 1000);
    });
  }

  updateOnAlertClose(type: string) {
      this.homeConfig[type] = false;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateFlameSensor(event: boolean) {
      this.homeConfig.flameSensor = event;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateImHomeSimulationSensor(event: boolean) {
      this.homeConfig.imHomeSimulation = event;
      this.http.setHomeSimulation(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateMethaneSensor(event: boolean) {
      this.homeConfig.methaneSensor = event;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }

  updateMotionSensor(event: boolean) {
      this.homeConfig.motionSensor = event;
      this.http.setSensorData(this.homeConfig)
      .subscribe((result) => {
          console.log(result);
      });
  }
}
