import { SortableGridDirective } from './sortable-grid/sortable-grid.directive';
import { SortDirective } from './sort/sort.directive';
import { NgModule } from '@angular/core';
import { HasPermissionDirective } from './has-permission/has-permission.directive';
@NgModule({
	declarations: [HasPermissionDirective, SortDirective, SortableGridDirective],
	imports: [],
	exports: [HasPermissionDirective, SortDirective, SortableGridDirective]
})
export class DirectivesModule {}
