import { Subscription } from 'rxjs/Subscription';
import { SortService } from './../../../core/services/sort/sort.service';
import { Directive, Input, ElementRef, OnInit, ViewContainerRef, TemplateRef, HostListener, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[sort]'
})
export class SortDirective implements OnInit {

  ionGridElement: ElementRef;

  @Input() columnName: string;
  ascending = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private sortService: SortService
  ) {
  }

  private columnSortedSubscription: Subscription;

  ngOnInit() {
    this.ionGridElement =  this.getOwnerGridElement(this.element.nativeElement);
    this.element.nativeElement.style.cursor = 'pointer';
    this.columnSortedSubscription =  this.sortService.sortColumnEvent.subscribe(event => {
      if (event.ionGridElement === this.ionGridElement) {
        const sortIcon = this.getSortIcon(this.element.nativeElement);
        if (event.columnName === this.columnName && !sortIcon) {
          // si l'action est effectuée sur une colonne où il n'y a pas de tri => on rajoute l'icone
          this.ascending = false;
          this.renderer.appendChild(this.element.nativeElement, this.sortService.descIcon);
        } else if (event.columnName === this.columnName && sortIcon) {
          // si l'action est effectuée sur la colonne où est déjà le tri précédent => on inverse le sens de l'icone
          this.renderer.removeChild(this.element.nativeElement, sortIcon);
          this.ascending = !this.ascending;
          this.renderer.appendChild(this.element.nativeElement, this.ascending ? this.sortService.ascIcon : this.sortService.descIcon);
        } else if (sortIcon) {
          // si l'action est effectuée sur une colonne autre que l'actuelle, on supprime l'icone de tri si elle existe
          this.renderer.removeChild(this.element.nativeElement, sortIcon);
        }

      }
    });
  }

  @HostListener('click') sort() {
    this.sortService.sortColumn(this.ionGridElement, this.columnName);
  }

  /**
   * Récupère l'élément ion-grid parent
   * @param element élément child
   * @return l'ion-grid parent si il y en  aun, sinon null
   */
  getOwnerGridElement ( element: any) {
    if ( !element || element == undefined ) {
      return null;
    }
    const parentElement = element.parentElement;
    if (parentElement && parentElement.nodeName && parentElement.nodeName.toLowerCase() === 'ion-grid') {
      return parentElement;
    }
    return this.getOwnerGridElement(parentElement);
  }

  /**
   * Récupère l'élément sortIcon parmi les child de l'élement en paramètre
   * @param element élément à sonder
   * @return élément sortIcon, sinon null
   */
  getSortIcon(element: any) {
    for (const node of element.childNodes) {
      if (node.id === SortService.SORT_ICON_ID) {
        return node;
      }
    }
    return null;
  }


}
