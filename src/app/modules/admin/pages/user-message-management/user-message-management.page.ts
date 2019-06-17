
import { TabHeaderModeEnum } from '../../../../core/enums/tab-header-mode.enum';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor.component';

import { UserMessageModel } from '../../../../core/models/admin/user-message.model';

import { UserMessageService } from '../../../../core/services/user-message/user-message.service';
import { UserMessageAlertService } from './../../../../core/services/user-message/user-message-alert.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

import { TextEditorModeEnum } from './../../../../core/enums/text-editor-mode.enum';

@Component({
    selector: 'page-user-message-management',
    templateUrl: 'user-message-management.page.html'
})
export class UserMessageManagementPage implements AfterViewInit {

    @ViewChild(TextEditorComponent) textEditorReference;

    userMessageForm: FormGroup;

    selectedUserMessage: UserMessageModel;

    userMessages: UserMessageModel[];

    textEditorMode: TextEditorModeEnum;

    TabHeaderModeEnum = TabHeaderModeEnum;


    constructor(private userMessageService: UserMessageService,
        private userMessageAlertService: UserMessageAlertService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder) {
        this.userMessageForm = formBuilder.group({
            title: ['', [Validators.maxLength(255)]],
            content: ['', [Validators.maxLength(5000)]],
            active: ['']
        });
    }

    ngAfterViewInit() { }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialise la page
     */
    initPage() {
        this.userMessageService.getAll().then(userMessages => {
            this.userMessages = userMessages;
        }, error => { });
    }

    /**
     * Ouvre le message dans le formulaire pour permettre sa modification
     * @param userMessage le message à modifier
     */
    editUserMessage(userMessage: UserMessageModel) {
        this.selectedUserMessage = userMessage;
    }

    /**
     * Met à jour un message
     * @param userMessage le message à mettre à jour
     */
    updateUserMessage() {
        this.selectedUserMessage.content = this.textEditorReference.content;
        this.userMessageService.update(this.selectedUserMessage).then(userMessage => {
            this.initPage();
            this.toastService.success(this.translateService.instant('ADMIN.USER_MESSAGE_MANAGEMENT.MESSAGES.UPDATE_SUCCESSFUL'));
        }, error => { });
    }

    /**
     * Affiche un aperçu du message en cours d'édition
     */
    displayOverview() {
        this.selectedUserMessage.content = this.textEditorReference.content;
        this.userMessageAlertService.displayUserMessage(this.selectedUserMessage);
    }

    /**
     * Vérifie si un message est sélectionné pour l'édition
     * @param userMessage le message à tester
     * @return vrai si le message est sélectionné, faux sinon
     */
    isUserMessageSelected(userMessage: UserMessageModel): boolean {
        return this.selectedUserMessage && this.selectedUserMessage.key === userMessage.key;
    }

    /**
     * Vérifie si le chargement des données nécessaires à l'affichage de la page est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    isLoadingOver(): boolean {
        return this.userMessages !== undefined;
    }
}
