import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cache-explorer',
  templateUrl: './cache-explorer.page.html',
  styleUrls: ['./cache-explorer.page.scss'],
})
export class CacheExplorerPage implements OnInit {
  dataFromCache = []
  PNC_PHOTO: string = 'PNC_PHOTO'

  constructor(private storage: Storage) {
  }

  ngOnInit() {
    this.loadDataFromCache();
  }

  /**
   * Charge les données du cache et supprime l'objet PNC_PHOTO
   */
  loadDataFromCache() {

    this.storage.get('EDossierPnc').then((data) => {
      this.dataFromCache = data;
      delete this.dataFromCache[this.PNC_PHOTO];
    });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.dataFromCache !== undefined;
  }

}
