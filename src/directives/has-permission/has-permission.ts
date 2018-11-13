import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

  @Input('hasPermission') permission: string;

  constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    if (!this.authorizationService.hasPermission(this.permission)) {
      this.el.nativeElement.remove();
    }
  }

}
