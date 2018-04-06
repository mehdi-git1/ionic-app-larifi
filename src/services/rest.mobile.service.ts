import { Injectable } from '@angular/core';
import { RestService, RestRequest } from './rest.base.service';  
import { SecMobilService } from './secMobil.service';
import { HttpClient } from '@angular/common/http';
 
  

@Injectable()
export class RestMobileService extends RestService {
  
    constructor(protected http: HttpClient,public secMobilService:SecMobilService) {
        super(http);      
    }
    
    public call(request: RestRequest): Promise<any> {
        return this.secMobilService.call(request);
    }
}