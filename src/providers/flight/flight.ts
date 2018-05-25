import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FlightProvider {

  constructor(public http: HttpClient) {
  }


}
