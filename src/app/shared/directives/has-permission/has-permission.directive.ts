import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../core/services/authorization/authorization.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

  @Input() permission: string;

  constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
  }

  ngOnInit(): void {
    if (!this.authorizationService.hasPermission(this.permission)) {
      this.el.nativeElement.remove();
    }
  }

}
