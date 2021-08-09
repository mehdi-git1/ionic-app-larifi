import {
  MailingModalComponent
} from 'src/app/shared/components/modals/mailing-modal/mailing-modal.component';

import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { MailingCampaignModel } from '../../models/mailing-campaign-model';
import { PncService } from '../pnc/pnc.service';
import { SessionService } from '../session/session.service';
import { ToastService } from '../toast/toast.service';
import { PncModel } from '../../models/pnc.model';


@Injectable({
  providedIn: 'root'
})
export class MailingService {
  private mailingModal: HTMLIonModalElement
  private mailingCampaignModel: MailingCampaignModel
  public mailSendConfirmationEvent = new EventEmitter();

  constructor(
    private mailModalController: ModalController,
    private pncService: PncService,
    private toastService: ToastService,
    private sessionService: SessionService,
    private translateService: TranslateService
  ) { }

  /**
   * Affiche la pop up d'envoi de mails
   * @param from le destinateur du mail
   * @param cciRecipients les destinataires en copie cachée
   * @param ccRecipients les destinataires en copie visible
   */
  public async openMailingModal(
    from: PncModel,
    cciRecipients: PncModel[],
    ccRecipients = []
  ) {
    this.mailingModal = await this.mailModalController.create({
      component: MailingModalComponent,
      componentProps: {
        from,
        cciRecipients,
        ccRecipients
      }
    })
    this.mailingModal.onDidDismiss().then(data => {
      this.handleDialogDissmis(data.data)
    })
    return await this.mailingModal.present()
  }

  /**
   * Gère la fermeture de la pop-up.
   * Déclenche l'envoi du mail si la pop-up a été fermée en cliquant
   * sur le bouton d'envoi du mail
   *
   * @param data les données du mail
   */
  handleDialogDissmis(data: any) {
    if (data) {
      console.log('data reçu' + JSON.stringify(data));
      this.mailingCampaignModel = new MailingCampaignModel()
      this.mailingCampaignModel.from = data.from.matricule;
      this.mailingCampaignModel.subject = data.subject;
      this.mailingCampaignModel.content = data.content;
      this.mailingCampaignModel.ccIrecipients = this.extractMatricules(data.cciRecipients);
      this.mailingCampaignModel.ccRecipients = this.extractMatricules(data.ccRecipients);
      this.mailingCampaignModel.ccRecipients.push(
        this.sessionService.authenticatedUser.matricule
      )
      this.mailingCampaignModel.attachmentFiles = data.attachmentFiles;
      console.log('object extrait ' + JSON.stringify(this.mailingCampaignModel));
      this.pncService
        .sendMailingCampaign(this.mailingCampaignModel)
        .then(() => {
          this.toastService.success(
            this.translateService.instant('MAILING_MODAL.SEND_CONFIRMATION')
          )
          this.mailSendConfirmationEvent.emit();
        });
    }

  }

  /**
   * Extrait les matricules des pncs dans la liste
   * @param pncs les pncs dont on souhaite recupérer les matricules
   * @returns les matricules des pnc
   */
  extractMatricules(pncs: PncModel[]): Array<string> {
    console.log('matricules à extraire' + JSON.stringify(pncs));
    return pncs.map(pnc => pnc.matricule);
  }
}


