import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  private sensorConfig: any;

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.http.getSensorData().subscribe(result => {
      console.log(result);
      this.sensorConfig = result;
    });
  }

  //   click() {
  //       this.http.post('http://localhost:3000/api/send', "valami")
  //       .subscribe((result) => {
  //           console.log(result);
  //       });
  //   }
}
