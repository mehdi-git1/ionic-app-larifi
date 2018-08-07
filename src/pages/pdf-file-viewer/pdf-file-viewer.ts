import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '../../../node_modules/@angular/common/http';


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
  pdfSrc: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
  public httpClient: HttpClient) {
  }

  ionViewCanEnter() {
    if (this.navParams.get('pdfSrc')) {
      this.title = this.navParams.get('title');
      this.httpClient.get(this.navParams.get('pdfSrc') , { responseType: 'blob'}).subscribe(result => {
        this.pdfSrc = URL.createObjectURL(result);
      });
    } else {
    }
  }

}
