import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  click() {
      this.http.post('http://localhost:3000/api/send', "valami")
      .subscribe((result) => {
          console.log(result);
      });
  }
}
