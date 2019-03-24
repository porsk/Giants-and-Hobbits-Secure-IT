import { Component, OnInit } from '@angular/core';
import { HttpService } from "src/app/services/http/http.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

    private entries: any[];

  constructor(private http: HttpService) { }

  ngOnInit() {
      this.http.getAllEntryLogs().subscribe((result: any[]) => {
          this.entries = result;
          console.log(this.entries);
      });
  }

}
