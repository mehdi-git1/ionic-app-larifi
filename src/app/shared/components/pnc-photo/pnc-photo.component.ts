import { PncPhotoModel } from './../../../core/models/pnc-photo.model';
import { ConnectivityService } from './../../../core/services/connectivity/connectivity.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { GenderService } from '../../../core/services/gender/gender.service';
import { PncPhotoService } from '../../../core/services/pnc-photo/pnc-photo.service';
import { Events } from 'ionic-angular';
import { OfflinePncPhotoService } from '../../../core/services/pnc-photo/offline-pnc-photo.service';

@Component({
  selector: 'pnc-photo',
  templateUrl: 'pnc-photo.component.html'
})
export class PncPhotoComponent implements OnInit, OnChanges {

  @Input() pnc: PncModel;
  @Input() size: number;
  @Input() handleCall = true;

  photoSrc: SafeResourceUrl;

  loading = false;

  constructor(private pncPhotoService: PncPhotoService,
    private offlinePncPhotoService: OfflinePncPhotoService,
    private genderProvider: GenderService,
    private domSanitizer: DomSanitizer,
    private events: Events) {
  }

  ngOnInit() {
    this.offlinePncPhotoService.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
      // Si on trouve une photo dans le cache, on l'affiche, sinon on affiche un spinner
      if (pncPhoto) {
        this.processPncPhoto(pncPhoto);
      } else {
        this.loading = true;
      }
    });

    if (!this.handleCall) {
      this.events.subscribe('PncPhoto:updated', (updatedPhotoMatricules) => {
        if (updatedPhotoMatricules.includes(this.pnc.matricule)) {
          this.offlinePncPhotoService.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
            this.processPncPhoto(pncPhoto);
            this.loading = false;
          });
        }
      });
    }
  }

  ngOnChanges() {
    if (this.handleCall) {
      this.getPhoto();
    }
  }

  /**
   * Récupère la photo du PNC donné en entrée
   */
  getPhoto() {
    if (this.pnc) {
      this.loading = true;
      this.pncPhotoService.getPncPhoto(this.pnc.matricule).then(pncPhoto => {
        this.processPncPhoto(pncPhoto);
      }, error => {
        this.photoSrc = this.genderProvider.getAvatarPicture(this.pnc.gender);
      }).then(() => {
        this.loading = false;
    });
    }
  }

  /**
   * Traite une photo pour l'utiliser dans le composant
   * @param pncPhoto la photo à traiter
   */
  private processPncPhoto(pncPhoto: PncPhotoModel) {
    if (pncPhoto && pncPhoto.photo) {
      this.photoSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${pncPhoto.photo}`);
    }
    else {
      this.photoSrc = this.genderProvider.getAvatarPicture(this.pnc.gender);
    }
  }
}
