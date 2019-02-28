import { EObservationLevelEnum } from './../../../../core/enums/e-observations-level.enum';
import { EObservationItemModel } from './../../../../core/models/eobservation/eobservation-item.model';
import { Component, Input, OnChanges } from '@angular/core';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EobservationDetailsPage } from '../../pages/eobservation-details/eobservation-details';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html'
})

export class EObservationComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  abnormalEObservationItems: EObservationItemModel[];

  @Input() eObservation;

  @Input() filteredEObservation;

  constructor(private navCtrl: NavController) {
  }

  ngOnChanges() {
    // On filtre les écarts de notation
    const eObs = this.filteredEObservation ? this.filteredEObservation : this.eObservation;
    if (eObs && eObs.eobservationItems) {
      this.abnormalEObservationItems = eObs.eobservationItems.filter(eObservationItem => {
        return this.isEObservationItemAbnormal(eObservationItem);
      });
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
   * Vérifie si l'eObservation peut être ouverte (afin de voir les écarts de notation)
   * @return vrai si l'eObservation peut être ouverte, faux sinon
   */
  canOpen(): boolean {
    return this.abnormalEObservationItems.length > 0;
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
    if (this.eObservation && (this.eObservation.type === 'E_CC' || this.eObservation.type === 'E_CCP')) {
      if (this.eObservation.val) {
        return ' - VAL';
      } else if (this.eObservation.formationFlight) {
        return ' - FOR';
      }
    }
    return '';
  }
}
