import { Component, Input } from '@angular/core';

import { CursusModel } from '../../../../core/models/professional-level/cursus.model';

@Component({
  selector: 'professional-level-cursus',
  templateUrl: 'professional-level-cursus.component.html',
  styleUrls: ['./professional-level-cursus.component.scss']
})
export class ProfessionalLevelCursusComponent {

  @Input() cursus: CursusModel;

  constructor() {

  }

}
