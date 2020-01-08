import { EdosPncMatPaginatorIntl } from './material.paginator.international';
import { NgModule } from '@angular/core';
import {
    DateAdapter, MAT_DATE_LOCALE, MatAutocompleteModule, MatButtonModule, MatCardModule,
    MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule,
    MatListModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule,
    NativeDateAdapter,
    MatPaginatorModule,
    MatPaginatorIntl
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

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
        MatCardModule
    ],
    providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        { provide: MatPaginatorIntl, useClass: EdosPncMatPaginatorIntl}
    ]
})
export class AppMaterialModule { }
