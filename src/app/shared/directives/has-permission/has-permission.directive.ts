import { Directive, Input, ElementRef, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthorizationService } from '../../../core/services/authorization/authorization.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private permission: string;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {
  }

  @Input()
  set hasPermission(val) {
    this.permission = val;
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  /**
   * Met à jour le template
   */
  private updateView() {
    this.viewContainer.clear();
    console.log(this.permission, ' ----- ', this.authorizationService.hasPermission(this.permission));
    if (this.authorizationService.hasPermission(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
