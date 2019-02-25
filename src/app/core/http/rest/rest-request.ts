export class RestRequest {
    public withCredential = true;
    public method: string;
    public url: string;
    public httpHeaders: any;
    public jsonData: any;
    public byPassImpersonatedUser: boolean;
    public byPassInterceptor: boolean;
}
