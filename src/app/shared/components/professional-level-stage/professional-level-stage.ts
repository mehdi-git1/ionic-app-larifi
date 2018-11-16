import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../core/models/professionalLevel/module';
import { Stage } from '../../../core/models/professionalLevel/stage';

@Component({
  selector: 'professional-level-stage',
  templateUrl: 'professional-level-stage.html'
})
export class ProfessionalLevelStageComponent {

  expandedHeight = '48px';

  _stages: Stage[];

  @Input()
  set stages(stages: Stage[]) {
    if (stages) {
      for (const stage of stages) {
        if (stage && stage.modules) {
          stage.modules = stage.modules.sort((module: Module, otherModule: Module) => {
            return module.date > otherModule.date ? 1 : -1;
          });
        }
      }
      this._stages = stages;
    }
  }
 }
