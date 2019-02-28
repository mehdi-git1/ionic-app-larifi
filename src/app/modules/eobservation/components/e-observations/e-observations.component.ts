import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'e-observations',
  templateUrl: 'e-observations.component.html'
})

export class EObservationsComponent implements OnChanges {

  matPanelHeaderHeight = '41px';
  isOlderThan3Years = false;
  nbOfYearsToChangeMessage = 3;

  @Input() eObservations: EObservationModel[];
  @Input() filterItems = false;

  constructor() {
  }

  ngOnChanges() {
    this.defineLegendMessage();
  }

  /**
   * Défini la légende à afficher en fonction de l'ancienneté des eObservations
   */
  defineLegendMessage(): void {
    if (this.eObservations[0]) {
      this.isOlderThan3Years = moment.duration(
        moment(moment())
          .diff(moment(this.eObservations[this.eObservations.length - 1].rotationDate)))
        .asYears() > this.nbOfYearsToChangeMessage;
    }
  }

  /**
   * Filtre les items de l'eobs pour ne garder que les écarts de notations avec "SECURITE DES VOLS" et "SURETE"
   * @param eObservation eObservation dont les items sont à filtrer
   * @return eObservation avec les items filtrés
   */
  filterEobsItems(eObservation: EObservationModel): EObservationModel{
    let filteredObservation = _.cloneDeep(eObservation);
    filteredObservation.eobservationItems = new Array();
    if (this.filterItems && eObservation && eObservation.eobservationItems) {
      /*for (const eObservationfilteredObservation.eobservationItems) {

      } */
      
      filteredObservation.eobservationItems = eObservation.eobservationItems.filter((element) => {
        if (element && element.refItemLevel && element.refItemLevel.item && element.refItemLevel.item.theme && element.refItemLevel.item.theme.label) {
          const upperCaseElement = element.refItemLevel.item.theme.label.toUpperCase();
          return upperCaseElement === 'SECURITE DES VOLS' || upperCaseElement === 'SURETE';
        } else {
          return false;
        }
      });
    }
    return filteredObservation;
  }
}
