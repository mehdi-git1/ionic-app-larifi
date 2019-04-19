import { EObservationDisplayModeEnum } from './../../../../core/enums/eobservation/eobservation-display-mode.enum';
import { EObservationLevelEnum } from './../../../../core/enums/e-observations-level.enum';
import { EObservationItemModel } from './../../../../core/models/eobservation/eobservation-item.model';
import { Component, Input, OnChanges } from '@angular/core';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EobservationDetailsPage } from '../../pages/eobservation-details/eobservation-details.page';
import { NavController } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { TranslateService } from '@ngx-translate/core';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/eobservation-referential-theme.model';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html'
})

export class EObservationComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  abnormalEObservationItems: EObservationItemModel[];

  @Input() eObservation: EObservationModel;

  @Input() eObservationDisplayMode: EObservationDisplayModeEnum;

  constructor(private navCtrl: NavController,
    private eObservationService: EObservationService) {
  }

  ngOnChanges() {
    // On filtre les écarts de notation
    if (this.eObservation && this.eObservation.eobservationThemes) {
      const allEObservationItems = new Array();
      this.eObservation.eobservationThemes.forEach(eobservationTheme => {
        this.processTheme(eobservationTheme, allEObservationItems);
      });

      this.abnormalEObservationItems = allEObservationItems.filter(eObservationItem => {
        return this.isEObservationItemAbnormal(eObservationItem);
      });
    }
  }

  /**
   * Extrait les items d'un thème et les ajoute à une liste passée en paramètre
   * @param referentialTheme le thème à traiter
   * @param allEObservationItems la liste à compléter
   */
  private processTheme(referentialTheme: ReferentialThemeModel, allEObservationItems: EObservationItemModel[]) {
    if (this.themeHasToBeDisplayed(referentialTheme)) {
      if (referentialTheme.eobservationItems) {
        for (const eObservationItem of referentialTheme.eobservationItems) {
          eObservationItem.refItemLevel.item.theme = referentialTheme;
          allEObservationItems.push(eObservationItem);
        }
      }
      if (referentialTheme.subThemes) {
        referentialTheme.subThemes.forEach(subTheme => {
          this.processTheme(subTheme, allEObservationItems);
        });
      }
    }
  }

  /**
   * Vérifie si un thème doit être affiché
   * @param referentialTheme le thème à tester
   * @return vrai si le thème doit être affiché, faux sinon
   */
  private themeHasToBeDisplayed(referentialTheme: ReferentialThemeModel): boolean {
    if (this.eObservationDisplayMode === EObservationDisplayModeEnum.PROFESSIONAL_LEVEL) {
      return referentialTheme.displayedInProfessionalLevel;
    }
    return true;
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
    return this.abnormalEObservationItems != null && this.abnormalEObservationItems.length > 0 && this.eObservation.type !== EObservationTypeEnum.E_PCB;
  }

  /**
   * Redirige vers le détail d'une eObservation
   * @param evt event
   */
  goToEObservationDetail(evt: Event): void {
    evt.stopPropagation();
    this.navCtrl.push(EobservationDetailsPage, { eObservationId: this.eObservation.techId });
  }

  /**
   * Récupère le label de l'option du type de l'eObs
   * @return le label à afficher
   */
  getDetailOptionType(): string {
    return this.eObservationService.getDetailOptionType(this.eObservation);
  }
}
