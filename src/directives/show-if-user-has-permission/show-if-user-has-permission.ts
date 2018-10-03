import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';

@Directive({
  selector: '[showIfUserHasPermission]'
})
export class ShowIfUserHasPermissionDirective implements OnInit {

  @Input('showIfUserHasPermission') permission: string;

  constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
  }

  ngOnInit () {
    if (!this.authorizationService.hasPermission(this.permission)) {
          this.el.nativeElement.style.display = 'none';
    }
  }

}
