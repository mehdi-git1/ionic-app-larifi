import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorService {

  public errorEvent: Subject<string> = new Subject<string>();
  constructor(
    private toastProvider: ToastService
  ) { }

  showError(message: string) {
    this.toastProvider.error(message, 10000);
    this.errorEvent.next(message);

  }
}
