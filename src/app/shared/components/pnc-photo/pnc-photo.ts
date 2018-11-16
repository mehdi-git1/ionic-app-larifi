import { GenderProvider } from '../../../core/services/gender/gender';
import { PncPhotoProvider } from '../../../core/services/pnc-photo/pnc-photo';
import { PncPhoto } from '../../../core/models/pncPhoto';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Pnc } from '../../../core/models/pnc';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'pnc-photo',
  templateUrl: 'pnc-photo.html'
})
export class PncPhotoComponent implements OnInit {

  @Input() pnc: Pnc;
  @Input() size: number;

  photoSrc: SafeResourceUrl;

  loading = false;

  constructor(private pncPhotoProvider: PncPhotoProvider,
    private genderProvider: GenderProvider,
    private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getPhoto();
  }

  /**
   * Récupère la photo du PNC donné en entrée
   */
  getPhoto() {
    this.loading = true;
    this.pncPhotoProvider.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
      if (pncPhoto && pncPhoto.photo) {
        this.photoSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${pncPhoto.photo}`);
      }
      else {
        this.photoSrc = this.genderProvider.getAvatarPicture(this.pnc.gender);
      }

      this.loading = false;
    }, error => {
      this.photoSrc = this.genderProvider.getAvatarPicture(this.pnc.gender);
      this.loading = false;
    });
  }

}
