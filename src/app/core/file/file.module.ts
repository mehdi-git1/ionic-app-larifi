import { NgModule } from '@angular/core';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

import { FileService } from './file.service';
import { HtmlService } from './html/html.service';
import { PdfService } from './pdf/pdf.service';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    PdfService,
    HtmlService,
    FileService,
    FileOpener
  ]
})

export class FileModule { }

