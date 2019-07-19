import { MatToolbarModule } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TextEditorModeEnum } from '../../../core/enums/text-editor-mode.enum';

@Component({
    selector: 'text-editor',
    templateUrl: 'text-editor.component.html',
})

export class TextEditorComponent {

    @Input() content: string;

    @Input() parentForm: FormGroup;

    @Input() ctrlForm: string;

    @Input() textEditorMode = TextEditorModeEnum.FULL;

    @Input() placeholder;

    @Output() contentFromChild = new EventEmitter();

    editorConfig;

    constructor() {

        // config du WYSIWYG par défaut
        this.editorConfig = {
            toolbar: []
        };

        // liste des options dans la barre d'outils
        if (this.textEditorMode == TextEditorModeEnum.FULL) {
            this.editorConfig.toolbar = [
                ['bold', 'italic', 'underline', 'strike'],

                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],

                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link']
            ];
        }
    }

    /**
     * envoie le contenu du WYSIWYG au parent
     */
    contentChange() {
        this.contentFromChild.emit(this.content);
    }
}
