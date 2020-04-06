import { NgModule } from '@angular/core';

import { HasPermissionDirective } from './has-permission/has-permission.directive';
import { IsBrowserDirective } from './is-browser/is-browser.directive';
import { SortDirective } from './sort/sort.directive';
import { SortableGridDirective } from './sortable-grid/sortable-grid.directive';

@NgModule({
    declarations: [HasPermissionDirective, SortDirective, SortableGridDirective, IsBrowserDirective],
    imports: [],
    exports: [HasPermissionDirective, SortDirective, SortableGridDirective, IsBrowserDirective]
})
export class DirectivesModule { }
