import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from './material/material.module';
import { PipesModule } from '../pipes/pipes.module';
import { TooltipsModule } from 'ionic-tooltips';

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
        TooltipsModule
    ],
    exports: [
        CommonModule,
        TranslateModule,
        AppMaterialModule,
        PipesModule,
        TooltipsModule
    ],
    providers: [
        AppMaterialModule
    ]
})
export class SharedModule {
    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('fr');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
    }
}
