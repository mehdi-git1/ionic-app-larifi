import { LogbookEventModeEnum } from 'src/app/core/enums/logbook-event/logbook-event-mode.enum';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';
import { NotifiedPncSpecialityEnum } from 'src/app/core/enums/notified-pnc-speciality.enum';
import {
  LogbookEventNotifiedPnc
} from 'src/app/core/models/logbook/logbook-event-notified-pnc.model';
import { PncTransformerService } from 'src/app/core/services/pnc/pnc-transformer.service';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
  CancelChangesService
} from '../../../../core/services/cancel_changes/cancel-changes.service';
import { Events } from '../../../../core/services/events/events.service';
import {
  OnlineLogbookEventService
} from '../../../../core/services/logbook/online-logbook-event.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';



@Component({
  selector: 'logbook-event',
  templateUrl: 'logbook-event.component.html',
  styleUrls: ['./logbook-event.component.scss']
})
export class LogbookEventComponent implements OnInit {

  @Input() logbookEvent: LogbookEventModel;

  @Input() mode: LogbookEventModeEnum;

  @Input() groupId: number;

  editEvent = false;
  eventDateString: string;
  pnc: PncModel;
  techId: number;

  logbookEventCategories: LogbookEventCategory[];
  updatedNotifiedPncList = new Array<LogbookEventNotifiedPnc>();
  originLogbookEvent: LogbookEventModel;

  titleMaxLength = 100;

  LogbookEventModeEnum = LogbookEventModeEnum;
  TextEditorModeEnum = TextEditorModeEnum;
  NotifiedPncSpecialityEnum = NotifiedPncSpecialityEnum;

  cancelFromButton = false;

  logbookEventForm: FormGroup;

  eventDateTimeOptions: any;

  customPopoverOptions = { cssClass: 'logbook-event-popover-select' };

  constructor(
    private securityService: SecurityService,
    private translateService: TranslateService,
    private sessionService: SessionService,
    private onlineLogbookEventService: OnlineLogbookEventService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private loadingCtrl: LoadingController,
    private dateTransformer: DateTransform,
    private events: Events,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private cancelChangeService: CancelChangesService,
    private pncTransformer: PncTransformerService,
    public elementRef: ElementRef) {
    this.initForm();
  }

  ngOnInit() {
    if (this.sessionService.visitedPnc) {
      this.pnc = this.sessionService.visitedPnc;
    } else {
      this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
    }
    this.initPage();
  }

  /**
   * Initialise le contenue de la page
   */
  initPage() {
    if (this.mode === LogbookEventModeEnum.CREATION || this.mode === LogbookEventModeEnum.LINKED_EVENT_CREATION) {
      this.editEvent = true;
      this.logbookEvent = new LogbookEventModel();
      if (typeof this.groupId !== 'undefined') {
        this.logbookEvent.groupId = this.groupId;
      }
      this.logbookEvent.pnc = new PncLightModel();
      this.logbookEvent.pnc.matricule = this.pnc.matricule;
      this.logbookEvent.pnc.matricule = this.pnc.matricule;
      this.logbookEvent.type = LogbookEventTypeEnum.EDOSPNC;
      const eventDate: Date = new Date();
      this.logbookEvent.eventDate = this.dateTransformer.transformDateToIso8601Format(eventDate);
      this.logbookEvent.notifiedPncs = new Array();
      if (this.pnc.pncInstructor && this.pnc.pncInstructor.matricule !== this.sessionService.getActiveUser().matricule) {
        const notifiedInstructor = new LogbookEventNotifiedPnc();
        notifiedInstructor.pnc = new PncModel();
        notifiedInstructor.pnc.matricule = this.pnc.pncInstructor.matricule;
        notifiedInstructor.speciality = NotifiedPncSpecialityEnum.REFERENT_INSTRUCTOR;
        this.logbookEvent.notifiedPncs.push(notifiedInstructor);
      }

    }
    if (LogbookEventModeEnum.EDITION == this.mode) {
      this.initUpdatedNotifiedPncList();
    }


    this.logbookEvent.mode = this.mode;
    this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
    this.eventDateString =
      this.logbookEvent ? this.logbookEvent.eventDate : this.dateTransformer.transformDateToIso8601Format(new Date());
  }

  /**
   * Initialise le formulaire et la liste déroulante des catégories depuis les paramètres
   */
  initForm() {
    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      this.logbookEventCategories = this.sessionService.getActiveUser().appInitData.logbookEventCategories;
    }

    this.logbookEventForm = this.formBuilder.group({
      eventDate: ['', Validators.required],
      pncInitiator: false,
      important: false,
      category: ['', Validators.required],
      title: ['', [Validators.maxLength(100), Validators.required]],
      content: ['', Validators.required],
      sendToPoleCSV: [false, Validators.required]
    });
  }

  /**
   *  Compare deux categories et renvois true si elles sont égales
   * @param category1 premiere categorie à comparér
   * @param category2 Deuxieme categorie à comparér
   */
  compareCategories(category1: LogbookEventCategory, category2: LogbookEventCategory): boolean {
    if (category1.id === category2.id) {
      return true;
    }
    return false;
  }

  /**
   * Annule la création / modification de l'évènement en appuyant sur le bouton annuler.
   */
  cancelLogbookEventCreationOrEdition() {
    this.cancelFromButton = true;
    if (this.formHasBeenModified()) {
      this.cancelChangeService.openCancelChangesPopup().then(
        confirm => {
          if (confirm) {
            this.quitEditionMode();
            return true;
          }
        }
      ).catch(() => {
        this.cancelFromButton = false;
        return false;
      });
    } else {
      this.quitEditionMode();
      return true;
    }
  }

  quitEditionMode() {
    this.logbookEvent = _.cloneDeep(this.originLogbookEvent);
    this.editEvent = false;
    if (this.cancelFromButton && this.mode === LogbookEventModeEnum.CREATION) {
      this.navCtrl.pop();
      this.cancelFromButton = false;
    } else if (this.cancelFromButton) {
      this.editEvent = false;
    }
    this.events.publish('LogbookEvent:canceled');
  }

  /**
   * Popup d'avertissement en cas de modifications non enregistrées.
   */
  confirmationPopoup(title: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
      this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [
          {
            text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
            role: 'cancel',
            handler: () => reject()
          },
          {
            text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
            handler: () => resolve()
          }
        ]
      }).then(alert => alert.present());
    });
  }


  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   * @return true si il n'y a pas eu de modifications
   */
  formHasBeenModified() {
    return this.logbookEvent.eventDate != this.originLogbookEvent.eventDate
      || Utils.getHashCode(this.originLogbookEvent) !== Utils.getHashCode(this.logbookEvent);
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.logbookEvent !== undefined && this.logbookEvent !== null;
  }

  /**
   * Enregistre l'évènement du journal de bord
   */
  saveLogbookEvent() {
    return new Promise((resolve, reject) => {
      const logbookEventToSave: LogbookEventModel = this.prepareLogbookEventBeforeSubmit(this.logbookEvent);
      this.loadingCtrl.create().then(loading => {
        loading.present();

        this.onlineLogbookEventService.createOrUpdate(logbookEventToSave)
          .then(savedLogbookEvent => {
            this.originLogbookEvent = _.cloneDeep(savedLogbookEvent);
            this.logbookEvent = savedLogbookEvent;
            this.events.publish('LogbookEvent:saved');
            if (this.mode === LogbookEventModeEnum.CREATION || this.mode === LogbookEventModeEnum.LINKED_EVENT_CREATION) {
              this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_SAVED'));
              if (this.mode === LogbookEventModeEnum.CREATION) {
                this.navCtrl.pop();
              }
            } else {
              this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_UPDATED'));
              this.editEvent = false;
            }
            loading.dismiss();
          }, error => {
            loading.dismiss();
          });
      });
    });
  }

  /**
   * Confirme la modification d'un évènement avec ou sans notification des personne concernés
   */
  confirmUpdateLogbookEvent() {
    if (this.isNotificationNeeded()) {
      return this.confirmationPopoup(
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.TITLE'),
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.MESSAGE'))
        .then(() => {
          this.saveLogbookEvent();
        }).catch(() => { });
    } else if (!this.isNotificationNeeded()) {
      this.confirmationPopoup(
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_EDIT_WITHOUT_NOTIFICATION.TITLE'),
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_EDIT_WITHOUT_NOTIFICATION.MESSAGE'))
        .then(() => {
          this.saveLogbookEvent();
        }).catch(() => { });
    } else {
      this.saveLogbookEvent();
    }
  }

  /**
  * Détermine si au moins, une notification doit être envoyée.
  * @returns vrai si au moins une notification doit être envoyée, faux sinon.
  */
  isNotificationNeeded(): boolean {
    return this.updatedNotifiedPncList && (this.updatedNotifiedPncList.length > 0 || this.logbookEventForm.get('sendToPoleCSV').value);
  }

  /**
   * Confirme l'enregistrement d'un évènement sans notifier les personne concernés
   */
  confirmSaveLogbookEvent() {

    if (!this.isNotificationNeeded()) {
      this.confirmationPopoup(
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_CREATE_WITHOUT_NOTIFICATION.TITLE'),
        this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_CREATE_WITHOUT_NOTIFICATION.MESSAGE'))
        .then(() => {
          this.saveLogbookEvent();
        }).catch(() => { });
    } else {
      this.saveLogbookEvent();
    }

  }


  /**
   * Prépare l'évènement du journal de bord avant de l'envoyer au back :
   * Transforme les dates au format iso
   * ou supprime l'entrée de l'objet si une ou plusieurs dates sont nulles
   *
   * @param logbookEventToSave l'évènement du journal de bord à enregistrer
   * @return l'évènement du journal de bord à enregistrer avec la date de rencontre transformée
   */
  prepareLogbookEventBeforeSubmit(logbookEventToSave: LogbookEventModel): LogbookEventModel {

    if (typeof this.logbookEvent.eventDate !== 'undefined' && this.logbookEvent.eventDate !== null) {
      logbookEventToSave.eventDate = this.dateTransformer.transformDateStringToIso8601Format(this.logbookEvent.eventDate);
    }

    logbookEventToSave.sendToPoleCSV = this.logbookEventForm.value.sendToPoleCSV;
    logbookEventToSave.notifiedPncs = this.updatedNotifiedPncList;
    return logbookEventToSave;
  }

  /**
   * Vérifie si le PNC est manager
   * @return vrai si le PNC est manager, faux sinon
   */
  isManager(): boolean {
    return this.securityService.isManager();
  }


  /**
   * Vérifie que le pnc fait partie des pnc notifiés
   * @param pnc le pnc dont on souhaite vérifie la notification
   * @return true si notifié, faux sinon.
   */
  isPncNotified(pnc: PncLightModel | PncModel): boolean {
    return pnc && pnc.matricule && this.updatedNotifiedPncList.some(eventNotifiedPnc => eventNotifiedPnc.pnc.matricule == pnc.matricule);
  }

  /**
   * Ajoute le ou les pnc cochés à la liste des pnc à notifier
   * @param myEvent l'event lié à la case à cocher
   * @param pnc la liste des pnc concernés
   * @param speciality la spécialité du ou des pnc concernés
   */
  updatePncNotifiedList(myEvent: any, pnc: PncLightModel, speciality: NotifiedPncSpecialityEnum) {
    if (myEvent.detail.checked && pnc.matricule) {
      this.addNotifiedPnc(pnc, speciality);
    } else {
      this.removeFromPncNotifiedList(pnc.matricule);
    }

  }

  /**
   * Supprime des pnc notifiés, le pnc au matricule passé en paramètre
   * @param matricule  le matricule du pnc à supprimer
   */
  removeFromPncNotifiedList(matricule: string) {
    this.updatedNotifiedPncList = this.updatedNotifiedPncList.filter(notifiedPnc => notifiedPnc.pnc.matricule != matricule);
  }

  /**
   * Ajoute, s'il n'existe pas, le pnc dans la liste des pnc notifiés
   * @param pnc  le pnc à ajouter
   */
  addNotifiedPnc(pnc: PncLightModel | PncModel, speciality: NotifiedPncSpecialityEnum) {
    const index = this.updatedNotifiedPncList.findIndex(eventNotifiedPnc => eventNotifiedPnc.pnc.matricule == pnc.matricule);
    if (index == -1) {
      const notifiedPnc = new LogbookEventNotifiedPnc();
      notifiedPnc.pnc = (pnc instanceof PncLightModel) ? this.pncTransformer.transformPncLightToPnc(pnc) : pnc;
      notifiedPnc.speciality = speciality;
      this.updatedNotifiedPncList.push(notifiedPnc);
    }
  }

  /**
   * initialise la liste des pnc notifiés en tenant compte 
   * des changements dans le management
   */
  initUpdatedNotifiedPncList() {
    this.logbookEvent.notifiedPncs.forEach(eventNotifiedPnc => {
      const rddHasNotChanged = eventNotifiedPnc.speciality == NotifiedPncSpecialityEnum.RDD && eventNotifiedPnc.pnc.matricule == this.pnc.pncRdd.matricule;
      const rdsHasNotChanged = eventNotifiedPnc.speciality == NotifiedPncSpecialityEnum.RDS && eventNotifiedPnc.pnc.matricule == this.pnc.pncRds.matricule;
      const instructorHasNotChanged = eventNotifiedPnc.speciality == NotifiedPncSpecialityEnum.REFERENT_INSTRUCTOR && eventNotifiedPnc.pnc.matricule == this.pnc.pncInstructor.matricule;

      if (rddHasNotChanged || rdsHasNotChanged || instructorHasNotChanged) {
        this.updatedNotifiedPncList.push(eventNotifiedPnc);
      }

    });
  }

}
