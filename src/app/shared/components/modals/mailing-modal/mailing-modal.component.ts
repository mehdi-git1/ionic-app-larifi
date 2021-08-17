import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppConstant } from 'src/app/app.constant';
import { DocumentModel } from 'src/app/core/models/document.model';
import { PncModel } from 'src/app/core/models/pnc.model';

@Component({
  selector: 'app-mailing-modal',
  templateUrl: './mailing-modal.component.html',
  styleUrls: ['./mailing-modal.component.scss']
})
export class MailingModalComponent implements OnInit {
  mailFormGroup: FormGroup

  @Input()
  from: PncModel;

  @Input()
  ccRecipients: Array<PncModel> = new Array();

  @Input()
  cciRecipients: Array<PncModel> = new Array();

  @Input()
  documents = new Array<DocumentModel>();


  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.mailFormGroup = this.formBuilder.group({
      from: [this.formatPnc(this.from), Validators.required],
      cciRecipients: [this.cciRecipients, Validators.required],
      ccRecipients: [this.ccRecipients],
      subject: ['', Validators.required],
      content: ['', Validators.required],
      attachmentFiles: [this.documents]
    })
  }

  /**
   * Ferme la pop-up d'envoi de mail sans transmettre les données
   */
  cancelMailing(): void {
    this.modalController.dismiss()
  }

  /**
   * Ferme la pop d'envoi de mail en transmettant les données du formulaire
   */
  sendMail(): void {
    this.mailFormGroup.patchValue({ from: this.from });
    this.modalController.dismiss(this.mailFormGroup.value);
  }
  /**
   * formate les informations d'identitié du pnc
   * @param pnc le pnc que l'on souhaite formater
   * @returns les infos du pnc formaté
   */
  formatPnc(pnc: PncModel): string {
    return pnc.lastName.concat(AppConstant.COMMA, AppConstant.SPACE, pnc.firstName);
  }

  /**
   * Supprime le pnc des destinaires en copie cachée
   * @param cciRecipient le pnc à supprimer
   */
  removeCciRecipients(cciRecipient: PncModel): void {
    this.cciRecipients = this.cciRecipients.filter(value => value.matricule !== cciRecipient.matricule);
  }

}
