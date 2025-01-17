import { NotificationsService } from 'angular2-notifications';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(private simpleNotification: NotificationsService) {
  }

  /**
   * Affiche un toast de succès
   * @param message le message à afficher dans le toast
   */
  success(message: string, timer = 5000) {
    this.simpleNotification.success(message, '', {
      timeOut: timer,
      showProgressBar: false,
      pauseOnHover: false,
      clickToClose: true,
      clickIconToClose: true
    });

  }

  /**
   * Affiche un toast d'avertissement
   * @param message le message à afficher dans le toast
   */
  warning(message: string, timer = 5000) {
    this.simpleNotification.warn(message, '', {
      timeOut: timer,
      showProgressBar: false,
      pauseOnHover: false,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  /**
   * Affiche un toast d'erreur
   * @param message le message à afficher dans le toast
   */
  error(message: string, timer = 5000) {
    this.simpleNotification.error(message, '', {
      timeOut: timer,
      showProgressBar: false,
      pauseOnHover: false,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  /**
   * Affiche un toast d'info
   * @param message le message à afficher dans le toast
   */
  info(message: string, timer = 5000) {
    this.simpleNotification.info(message, '', {
      timeOut: timer,
      showProgressBar: false,
      pauseOnHover: false,
      clickToClose: true,
      clickIconToClose: true
    });
  }
}
