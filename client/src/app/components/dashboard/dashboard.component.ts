import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  public homeConfig: any;

  constructor(public http: HttpService) {}

  ngOnInit() {
    this.http.getSensorData().subscribe(result => {
      this.homeConfig = result;
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
