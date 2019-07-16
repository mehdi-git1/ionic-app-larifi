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

    @Output() contentFromChild = new EventEmitter();

    editorConfig;



    constructor() {

        // config du WYSIWYG par défaut
        this.editorConfig = {
        };


        // liste des options dans la barre d'outils
        if (this.textEditorMode == TextEditorModeEnum.FULL) {
            this.editorConfig.toolbar = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
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
