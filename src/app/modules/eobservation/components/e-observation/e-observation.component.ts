import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import {
  EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import {
  EObservationItemModel
} from '../../../../core/models/eobservation/eobservation-item.model';
import {
  ReferentialThemeModel
} from '../../../../core/models/eobservation/eobservation-referential-theme.model';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html',
  styleUrls: ['./e-observation.component.scss']
})

export class EObservationComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  abnormalEObservationItems: EObservationItemModel[];

  @Input() eObservation: EObservationModel;

  @Input() eObservationDisplayMode: EObservationDisplayModeEnum;

  @Output() detailButtonClicked = new EventEmitter();

  EObservationDisplayModeEnum = EObservationDisplayModeEnum;

  constructor(
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
   * Vérifie si un élément de l'eObservation est en "écart de notation"
   * @param eObservationItem l'élément à vérifier
   *  @return vrai si l'élément est en écart, faux sinon
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
    return this.abnormalEObservationItems != null
      && this.abnormalEObservationItems.length > 0
      && this.eObservation.type !== EObservationTypeEnum.E_PCB
  }

  /**
   * Redirige vers le détail d'une eObservation
   * @param evt event
   */
  goToEObservationDetail(evt: Event): void {
    evt.stopPropagation();
    this.detailButtonClicked.emit(this.eObservation.techId);
  }

  /**
   * Récupère le label du type de l'eObservation
   * @return le label du type de l'eObservation
   */
  getEObservationTypeLabel(): string {
    return this.eObservationService.getEObservationTypeLabel(this.eObservation);
  }
}
