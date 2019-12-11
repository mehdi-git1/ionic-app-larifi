import { ComponentsModule } from 'src/app/shared/components/components.module';
import { IonicModule } from '@ionic/angular';
import { BusinessIndicatorsPage } from './pages/business-indicators.page';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      BusinessIndicatorsPage
    ],
    imports: [
      IonicModule,
      SharedModule,
      ComponentsModule,
      FormsModule,
      ReactiveFormsModule
    ],
    entryComponents: [
      BusinessIndicatorsPage
    ],
    exports: [],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: []
  })

  export class BusinessIndicatorsModule {}
