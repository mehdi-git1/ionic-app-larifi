import { Component, Input, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';

import {
    BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import { DeviceService } from '../../../../core/services/device/device.service';

@Component({
  selector: 'escore-chart',
  templateUrl: 'escore-chart.component.html',
  styleUrls: ['./escore-chart.component.scss']
})

export class EscoreChartComponent implements OnInit {

  @Input() businessIndicator: BusinessIndicatorModel;
  data: any;
  xAxisLabel: string;

  constructor(
    private translateService: TranslateService,
    private deviceService: DeviceService,
    private screenOrientation: ScreenOrientation
  ) {

    console.log(this.screenOrientation.type);
    this.detectOrientation();
  }

  ngOnInit() {
    console.log(this.data);
    setTimeout(() => this.initChart(), 2000);
    console.log(this.data);
  }

  /**
   * Initialise les données du graphiques à partir de l'objet indicateur métier reçu en entrée du composant
   */
  initChart() {
    this.data = [
      {
        name: this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.ESCORE_100'),
        value: this.businessIndicator.escore100
      },
      {
        name: this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.ESCORE_75'),
        value: this.businessIndicator.escore75
      },
      {
        name: this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.ESCORE_50'),
        value: this.businessIndicator.escore50
      },
      {
        name: this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.ESCORE_25'),
        value: this.businessIndicator.escore25
      },
      {
        name: this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.ESCORE_0'),
        value: this.businessIndicator.escore0
      }
    ];

    this.xAxisLabel = this.translateService.instant('BUSINESS_INDICATORS.DETAIL.ESCORE_SUMMARY.X_AXIS_LABEL');
  }

  /**
   * Formatte les labels de l'axe X (on ne souhaite pas avoir de valeur décimales)
   * @param value la valeur
   * @return la valeur formattée
   */
  formatXAxisTick(value) {
    return value % 1 === 0 ? value : '';
  }

  /**
   * Récupère la couleur des barres du graphique
   * @return la couleur au format hexa
   */
  getBarColor(): string {
    return '#00818E';
  }

  /**
   * Vérifie qu'on a des eScores à afficher (le graphique rend mal avec toutes les valeurs à 0)
   * @return vrai si c'est le cas, faux sinon
   */
  hasEscoreToDisplay() {
    return !this.data.map(entry => entry.value).every((value, index, array) => value === 0);
  }

  /**
   * Vérifie si on est sur mobile ou non
   * @return vrai si c'est le cas, faux sinon
   */
  isMobile() {
    return !this.deviceService.isBrowser();
  }

  detectOrientation() {
    this.screenOrientation.onChange().subscribe(
      () => {

        console.log('Orientation change');
        console.log(this.screenOrientation.type);
        this.data = [];
        setTimeout(() => this.initChart(), 2000);
      }
    );
  }
}
