import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
