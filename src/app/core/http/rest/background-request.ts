import { RestRequest } from './rest-request';

export class BackgroundRequest {
    promise: Promise<any>;
    resolve: any;
    reject: any;

    request: RestRequest;
}
