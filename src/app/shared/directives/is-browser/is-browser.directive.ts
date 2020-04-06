import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';

@Directive({
  selector: '[isBrowser]'
})
export class IsBrowserDirective implements OnInit {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceService
  ) {
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.deviceService.isBrowser()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
