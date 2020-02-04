import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { UserMessageModel } from '../../../../core/models/admin/user-message.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    UserMessageAlertService
} from '../../../../core/services/user-message/user-message-alert.service';
import { UserMessageService } from '../../../../core/services/user-message/user-message.service';
import {
    TextEditorComponent
} from '../../../../shared/components/text-editor/text-editor.component';

@Component({
    selector: 'page-user-message-management',
    templateUrl: 'user-message-management.page.html',
    styleUrls: ['./user-message-management.page.scss']
})
export class UserMessageManagementPage {

    @ViewChild(TextEditorComponent, { static: false }) textEditorReference;

    userMessageForm: FormGroup;

    selectedUserMessage: UserMessageModel;

    TextEditorModeEnum = TextEditorModeEnum;

    userMessages: UserMessageModel[];
    TabHeaderEnum = TabHeaderEnum;

    constructor(
        private userMessageService: UserMessageService,
        private userMessageAlertService: UserMessageAlertService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder) {
        this.userMessageForm = formBuilder.group({
            title: ['', [Validators.maxLength(255)]],
            content: [''],
            active: ['']
        });
    }

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
        this.userMessageService.update(this.selectedUserMessage).then(userMessage => {
            this.initPage();
            this.toastService.success(this.translateService.instant('ADMIN.USER_MESSAGE_MANAGEMENT.MESSAGES.UPDATE_SUCCESSFUL'));
        }, error => { });
    }

    /**
     * Affiche un aperçu du message en cours d'édition
     */
    displayOverview() {
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
