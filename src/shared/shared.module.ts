import { AuthGuard } from './../guard/auth.guard';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';



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
        })
    ],
    exports: [
      CommonModule,
      TranslateModule
    ],
    providers: [
        AuthGuard
    ]
})
export class SharedModule {
     constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('en');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }
}
