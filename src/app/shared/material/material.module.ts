import { NgModule } from '@angular/core';
import {
    DateAdapter, MAT_DATE_LOCALE, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule,
    MatInputModule, MatListModule, MatNativeDateModule, MatPaginatorIntl, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSidenavModule, MatSortModule,
    MatTableModule, MatToolbarModule, MatTooltipModule, NativeDateAdapter
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

import { EdossierPaginationIntl } from './Edossier-Pagination-Intl';

@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonToggleModule
  ],
  providers: [
    TranslateService,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MatPaginatorIntl, useClass: EdossierPaginationIntl },
  ]
})
export class AppMaterialModule { }
