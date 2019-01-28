import { CursusModel } from './../../../../core/models/professional-level/cursus.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'professional-level-cursus',
  templateUrl: 'professional-level-cursus.component.html'
})
export class ProfessionalLevelCursusComponent {

  @Input() cursus: CursusModel;

  constructor() {

  }

}
