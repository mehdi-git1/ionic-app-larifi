import { Component, Input, OnChanges } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { GenderService } from '../../../core/services/gender/gender.service';
import { PncPhotoService } from '../../../core/services/pnc-photo/pnc-photo.service';

@Component({
  selector: 'pnc-photo',
  templateUrl: 'pnc-photo.component.html'
})
export class PncPhotoComponent implements OnChanges {

  @Input() pnc: PncModel;
  @Input() size: number;

  photoSrc: SafeResourceUrl;

  loading = false;

  constructor(private pncPhotoProvider: PncPhotoService,
    private genderProvider: GenderService,
    private domSanitizer: DomSanitizer) {
  }

  ngOnChanges() {
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
