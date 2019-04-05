import { EObservationLevelEnum } from './../../../../core/enums/e-observations-level.enum';
import { EObservationItemModel } from './../../../../core/models/eobservation/eobservation-item.model';
import { Component, Input, OnChanges } from '@angular/core';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EobservationDetailsPage } from '../../pages/eobservation-details/eobservation-details.page';
import { NavController } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { TranslateService } from '@ngx-translate/core';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html'
})

export class EObservationComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  abnormalEObservationItems: EObservationItemModel[];

  @Input() eObservation: EObservationModel;

  @Input() filteredEObservation: EObservationModel;

  constructor(private navCtrl: NavController,
    private eObservationService: EObservationService) {
  }

  ngOnChanges() {
    // On filtre les écarts de notation
    const eObs = this.filteredEObservation ? this.filteredEObservation : this.eObservation;
    if (eObs && eObs.eobservationItems) {
      const abnormalEObservationItems: EObservationItemModel[] = eObs.eobservationItems.filter(eObservationItem => {
        return this.isEObservationItemAbnormal(eObservationItem);
      });
      this.abnormalEObservationItems = abnormalEObservationItems.sort((a, b) => this.sortByThemeOrderAndItemOrder(a, b));
    }
  }

  /**
   * Trie les ecarts de notations par ordre de theme
   * @param a first element
   * @param b second element
   * @return 1 si a est après b, sinon -1
   */
  private sortByThemeOrderAndItemOrder(a: EObservationItemModel, b: EObservationItemModel): number {
    if (a && a.refItemLevel && a.refItemLevel.item && a.refItemLevel.item.theme &&
      b && b.refItemLevel && b.refItemLevel.item && b.refItemLevel.item.theme &&
      (a.refItemLevel.item.theme.themeOrder > b.refItemLevel.item.theme.themeOrder)) {
      return 1;
    } else {
      return -1;
    }
  }


  /**
  * Récupère le label à afficher par rapport type d'eObservation donné
  * @param level le niveau de l'eObservation
  * @return le label à afficher
  */
  getEObservationTypeLabel(eObservationType: EObservationTypeEnum) {
    return EObservationTypeEnum.getLabel(eObservationType);
  }

  /**
  * Vérifie si un élément de l'eObservation est en "écart de notation"
  * @param eObservationItem l'élément à vérifier
  * @return vrai si l'élément est en écart, faux sinon
  */
  isEObservationItemAbnormal(eObservationItem: EObservationItemModel): boolean {
    return eObservationItem.refItemLevel.level !== EObservationLevelEnum.LEVEL_3
      && eObservationItem.refItemLevel.level !== EObservationLevelEnum.NO
      && eObservationItem.refItemLevel.level !== EObservationLevelEnum.C;
  }

  /**
   * Vérifie si l'eObservation peut être ouverte (afin de voir les écarts de notation).
   * Les ePCB ne peuvent pas être ouvertes.
   * @return vrai si l'eObservation peut être ouverte, faux sinon
   */
  canOpen(): boolean {
    return this.abnormalEObservationItems.length > 0 && this.eObservation.type !== EObservationTypeEnum.E_PCB;
  }

  /**
   * Redirige vers le détail d'une eObservation
   * @param evt event
   */
  goToEObservationDetail(evt: Event): void {
    evt.stopPropagation();
    this.navCtrl.push(EobservationDetailsPage, { eObservation: this.eObservation });
  }

  /**
   * Récupère le label de l'option du type de l'eObs
   * @return le label à afficher
   */
  getDetailOptionType(): string {
    return this.eObservationService.getDetailOptionType(this.eObservation);
  }
}
