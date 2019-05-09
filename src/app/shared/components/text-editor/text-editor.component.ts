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

    @Input() formIsExist: boolean;

    @Input() ctrlForm: string;

    @Input() textEditorMode = TextEditorModeEnum.FULL;

    @Output() returnContent = new EventEmitter();

    editorConfig;

    constructor() {

        // config du WYSIWYG par défaut
        this.editorConfig = {
            editable: true,
            spellcheck: true,
            height: 'auto',
            minHeight: '20rem',
            width: 'auto',
            minWidth: '5rem',
            translate: 'no',
            placeholder: '',
            enableToolbar: true,
            showToolbar: true
        };

        // liste des options dans la barre d'outils
        if (this.textEditorMode == TextEditorModeEnum.FULL) {
            this.editorConfig.toolbar = [
                ['bold', 'italic', 'underline', 'strikeThrough'],
                ['fontName', 'fontSize', 'color'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
                ['undo', 'redo'],
                ['horizontalLine', 'orderedList', 'unorderedList'],
                ['link', 'unlink']
            ];
        }
    }

    /**
     * envoie le contenu du WYSIWYG au parent
     */
    contentChange() {
        this.returnContent.emit(this.content);
    }
}
