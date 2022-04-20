import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { EntityEnum } from 'src/app/core/enums/entity.enum';
import { AppConstant } from 'src/app/app.constant';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-cache-explorer',
  templateUrl: './cache-explorer.page.html',
  styleUrls: ['./cache-explorer.page.scss'],
})
export class CacheExplorerPage implements OnInit {
  dataFromCache = [];
  data = [];
  selectedItem: string;
  enumLabels = [];
  valueAll = AppConstant.ALL;
  isLoading = false;
  message = false;

  constructor(private storage: Storage) {
  }

  ngOnInit() {
    this.getEntityEnumKey();
    this.loadDataFromCache();
  }

  /**
   * Charge les données du cache
   */
  loadDataFromCache() {
    this.storage.get('EDossierPnc').then((cacheData) => {
      this.dataFromCache = cacheData;
      this.data = cacheData;
      delete this.dataFromCache[EntityEnum.PNC_PHOTO]
      if ((Utils.getSizeOfObject(this.dataFromCache[EntityEnum.PNC]) > AppConstant.ENTITY_CACHE_SIZE)
        || (Utils.getSizeOfObject(this.dataFromCache[EntityEnum.PROFESSIONAL_INTERVIEW]) > AppConstant.ENTITY_CACHE_SIZE)
        || (Utils.getSizeOfObject(this.dataFromCache[EntityEnum.PROFESSIONAL_LEVEL]) > AppConstant.ENTITY_CACHE_SIZE)
        || (Utils.getSizeOfObject(this.dataFromCache[EntityEnum.CAREER_OBJECTIVE]) > AppConstant.ENTITY_CACHE_SIZE)
        || (Utils.getSizeOfObject(this.dataFromCache[EntityEnum.WAYPOINT]) > AppConstant.ENTITY_CACHE_SIZE)
        || (Utils.getSizeOfObject(this.dataFromCache[EntityEnum.USER_MESSAGE]) > AppConstant.ENTITY_CACHE_SIZE)) {
        this.selectedItem = EntityEnum.AUTHENTICATED_USER;
        this.dataFromCache = this.dataFromCache[this.selectedItem];
        this.message = true;
      }
      this.isLoading = true;
    });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.isLoading;
  }

  /**
   * Filtre les données du cache par rapport à la valeur selectionnée
   */
  selectedEntity(selectedItem: string) {
    selectedItem !== this.valueAll ? this.dataFromCache = this.data[selectedItem] : this.loadDataFromCache();
  }

  /**
   * Initialise les valeurs de EntityEnum dans un tableau
   */
  getEntityEnumKey() {
    this.enumLabels = Object.keys(EntityEnum).map((label) => {
      return label
    })
    Utils.arrayRemoveValue(this.enumLabels, EntityEnum.PNC_PHOTO)
  }
}
