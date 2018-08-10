import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class ToastProvider {

  constructor(private toastCtrl: ToastController,
    private simpleNotification: NotificationsService) {
  }

  /**
   * Affiche un toast de succès
   * @param message le message à afficher dans le toast
   */
  success(message: string) {
    /*this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'success'
    }).present();*/
    this.simpleNotification.success(message, '', {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });

  }

  /**
   * Affiche un toast d'avertissement
   * @param message le message à afficher dans le toast
   */
  warning(message: string) {
    /*this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      cssClass: 'warning'
    }).present();*/
    this.simpleNotification.warn(message, '', {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  /**
   * Affiche un toast d'erreur
   * @param message le message à afficher dans le toast
   */
  error(message: string) {
    /*  this.toastCtrl.create({
        message: message,
        duration: 5000,
        position: 'bottom',
        cssClass: 'error'
      }).present();
  */
    this.simpleNotification.error(message, '', {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  /**
  * Affiche un toast d'info
  * @param message le message à afficher dans le toast
  */
  info(message: string) {
    /*this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'info'
    }).present();*/
    this.simpleNotification.info(message, '', {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });

  }

}
