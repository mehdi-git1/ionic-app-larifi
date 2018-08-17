import { GenderProvider } from './../../providers/gender/gender';
import { PncPhotoProvider } from './../../providers/pnc-photo/pnc-photo';
import { PncPhoto } from './../../models/pncPhoto';
import { Component, Input, OnChanges } from '@angular/core';
import { Pnc } from '../../models/pnc';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'pnc-photo',
  templateUrl: 'pnc-photo.html'
})
export class PncPhotoComponent implements OnChanges {

  @Input()
  pnc: Pnc;

  photoSrc: SafeResourceUrl;

  loading = false;

  constructor(private pncPhotoProvider: PncPhotoProvider,
    private genderProvider: GenderProvider,
    private domSanitizer: DomSanitizer) {
  }

  ngOnChanges() {
    this.getPhoto();
  }

  getPhoto() {
    this.loading = true;
    this.pncPhotoProvider.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
      if (pncPhoto.photo != null) {
        this.photoSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${pncPhoto.photo}`);
      }
      else {
        this.photoSrc = this.genderProvider.getAvatarPicture(this.pnc.gender);
      }

      this.loading = false;
    }, error => { });
  }

}
