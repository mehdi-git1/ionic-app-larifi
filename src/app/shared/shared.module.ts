import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DirectivesModule } from './directives/directives.module';
import { AppMaterialModule } from './material/material.module';
import { PipesModule } from './pipes/pipes.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DateTransform } from './utils/date-transform';
import { Utils } from './utils/utils';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    PipesModule,
    DirectivesModule,
    PdfViewerModule,
    NgxJsonViewerModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    AppMaterialModule,
    PipesModule,
    DirectivesModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxJsonViewerModule
  ],
  providers: [
    AppMaterialModule,
    Utils,
    DateTransform,
    DatePipe,
    File,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('fr');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
  }
}
