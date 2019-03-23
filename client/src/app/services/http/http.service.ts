import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { config } from "../../config";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public getSensorData() {
    return this.http.get(config.apiURL + "/config");
  }

  public setSensorData(data: any) {
    return this.http.put(config.apiURL + "/config", data);
  }
}
