import { Component, Input } from '@angular/core';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { TranslateService } from '@ngx-translate/core';
import { PncModel } from '../../../../core/models/pnc.model';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';

@Component({
  selector: 'eobs-comment',
  templateUrl: 'eobs-comment.component.html'
})
export class EObsCommentComponent {

  @Input() type: PncRoleEnum;

  @Input() eObservation: EObservationModel;

  @Input() canEditPncComment = false;

  constructor(private translateService: TranslateService) {
  }

  /**
   * Retourne le titre à afficher en fonction du type de commentaire
   * @return le titre à afficher
   */
  getTitle(): string {
    if (this.isManagerComment()) {
      return this.translateService.instant('EOBSERVATION.DETAILS.REDACTOR_COMMENT');
    } else {
      return this.translateService.instant('EOBSERVATION.DETAILS.PNC_COMMENT');
    }
  }

  /**
   * Récupère l'auteur du commentaire à afficher
   * @return l'auteur du commentaire à afficher
   */
  getCommentAuthor(): PncModel {
    if (this.eObservation) {
      return this.isManagerComment() ? this.eObservation.redactor : this.eObservation.pnc;
    }
    return undefined;
  }

  /**
   * Récupère la spécialité de l'auteur du commentaire
   * @return la spécialité de l'auteur du commentaire
   */
  getAuthorSpeciality(): SpecialityEnum {
    return this.isManagerComment() ? this.eObservation.redactorSpeciality : this.eObservation.pncSpeciality;
  }

  /**
   * Récupère le commentaire à afficher
   * @return le commentaire à afficher
   */
  getComment(): string {
    if (this.eObservation) {
      return this.isManagerComment() ? this.eObservation.redactorComment : this.eObservation.pncComment;
    }
    return undefined;
  }

  /**
   * Teste si le commentaire à afficher est celui du PNC
   * @return vrai si c'est le cas, faux sinon
   */
  isPncComment(): boolean {
    return this.type === PncRoleEnum.PNC;
  }

  /**
   * Teste si le commentaire à afficher est celui de l'instructeur
   * @return vrai si c'est le cas, faux sinon
   */
  isManagerComment(): boolean {
    return this.type === PncRoleEnum.MANAGER;
  }

  /**
   * Vérifie si le commentaire est vide ou non
   * @return vrai si le commentaire est vide, faux sinon
   */
  isEmpty(): boolean {
    if (this.isManagerComment()) {
      return this.eObservation && !this.eObservation.redactorComment && this.eObservation && !this.eObservation.strongPoints && !this.eObservation.workingAxes;
    } else {
      return this.eObservation && !this.eObservation.pncComment && !this.canEditPncComment;
    }
  }
}
