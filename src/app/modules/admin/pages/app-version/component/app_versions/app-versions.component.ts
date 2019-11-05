import { Component, Input } from '@angular/core';

import { AppVersionModel } from '../../../../../../core/models/admin/app-version.model';

@Component({
  selector: 'app-versions',
  templateUrl: 'app-versions.component.html',
  styleUrls: ['./app-versions.component.scss']
})
export class AppVersionsComponent {

  matPanelHeaderHeight = '41px';

  @Input() appVersions: AppVersionModel[];

  constructor() { }
}
