import { PncPhotoProvider } from './../../providers/pnc-photo/pnc-photo';
import { PncPhoto } from './../../models/pncPhoto';
import { Component, Input } from '@angular/core';
import { Pnc } from '../../models/pnc';

@Component({
  selector: 'pnc-photo',
  templateUrl: 'pnc-photo.html'
})
export class PncPhotoComponent {

  @Input()
  pnc: Pnc;

  pncPhoto: PncPhoto;

  constructor(private pncPhotoProvider: PncPhotoProvider) {
    console.log(this.pnc);
    this.pncPhoto = new PncPhoto();
  }

  getPhoto() {
    console.log('pncPhoto');
    this.pncPhotoProvider.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
      this.pncPhoto = pncPhoto;
      console.log(pncPhoto);
    }, error => { });
  }

}
