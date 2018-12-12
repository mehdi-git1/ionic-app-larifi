import { NgModule } from '@angular/core';

import { HtmlService } from './html/html.service';
import { PdfService } from './pdf/pdf.service';
import { FileService } from './file.service';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    PdfService,
    HtmlService,
    FileService
  ]
})

export class FileModule { }

