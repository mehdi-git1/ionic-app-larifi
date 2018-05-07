import { ToastController, Toast } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastProvider {

  constructor(private toastCtrl: ToastController) {
  }

  /**
   * Affiche un toast de succès
   * @param message le message à afficher dans le toast
   */
  success(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'success'
    }).present();
  }

  /**
   * Affiche un toast d'erreur
   * @param message le message à afficher dans le toast
   */
  error(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      cssClass: 'error'
    }).present();
  }

  /**
  * Affiche un toast d'info
  * @param message le message à afficher dans le toast
  */
  info(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'info'
    }).present();
  }

}
