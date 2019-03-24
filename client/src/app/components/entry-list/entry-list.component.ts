import { Component, OnInit } from '@angular/core';
import { HttpService } from "src/app/services/http/http.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

    public entries: any[];

  constructor(public http: HttpService) { }

  ngOnInit() {
      this.http.getAllEntryLogs().subscribe((result: any[]) => {
          this.entries = result;
      });
  }

}
