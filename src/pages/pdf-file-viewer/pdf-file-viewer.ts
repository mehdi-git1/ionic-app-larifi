import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name: 'PdfFileViewerPage',
  segment: 'help/:pdfSrc',
  defaultHistory: ['PncHomePage']
})
@Component({
  selector: 'page-pdf-viewer',
  templateUrl: 'pdf-file-viewer.html',
})
export class PdfFileViewerPage {

  title: string;
  pdfSrc: string;
  noPdf: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    if (this.navParams.get('pdfSrc')) {
      this.title = this.navParams.get('title');
      this.noPdf = false;
      this.pdfSrc = this.navParams.get('pdfSrc');
    } else {
      this.noPdf = true;
    }
  }

}
