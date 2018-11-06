import { Component, Input } from '@angular/core';
import { Module } from '../../models/professionalLevel/module';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.html'
})
export class ModuleCardComponent {

  @Input() module: Module;

  constructor() {
  }

  /**
   * Retourne la classe correspondant à la couleur du point en fonction du statut du module
   */
  getModuleStatusPointCssClass(): string {
    if ('SUCCESS' == this.module.moduleResultStatus) {
      return 'green-point';
    } else if ('SUCCESS_WITH_FC' == this.module.moduleResultStatus) {
      return 'orange-point';
    } else if ('FAILED' == this.module.moduleResultStatus) {
      return 'red-point';
    }
    return '';
  }
}
