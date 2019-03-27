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

  @Input() legend = true;

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
    const filteredObservation = _.cloneDeep(eObservation);
    if (!this.filterItems) {
      // on ne filtre pas les items dans ce cas-là
      return eObservation;
    }
    filteredObservation.eobservationItems = new Array();
    if (this.filterItems && eObservation && eObservation.eobservationItems) {
      filteredObservation.eobservationItems = eObservation.eobservationItems.filter((element) => {
        return element && element.refItemLevel && element.refItemLevel.item && element.refItemLevel.item.theme && element.refItemLevel.item.theme.displayedInProfessionalLevel;
      });
    }
    return filteredObservation;
  }
}
