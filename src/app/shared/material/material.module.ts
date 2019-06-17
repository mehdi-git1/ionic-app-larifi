import { NgModule } from '@angular/core';
import { MatTooltipModule, MatSortModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import {
    DateAdapter,
    MatNativeDateModule,
    NativeDateAdapter
} from '@angular/material';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';

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
        MatListModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSelectModule,
        MatProgressBarModule,
        MatExpansionModule
    ],
    providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
    ]
})
export class AppMaterialModule { }
