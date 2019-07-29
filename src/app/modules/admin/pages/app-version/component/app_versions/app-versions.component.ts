import { AppVersionModel } from './../../../../../../core/models/admin/app-version.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-versions',
  templateUrl: 'app-versions.component.html'
})
export class AppVersionsComponent {

  matPanelHeaderHeight = '41px';

  @Input() appVersions: AppVersionModel[];

  constructor() { }
}
