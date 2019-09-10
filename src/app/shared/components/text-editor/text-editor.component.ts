import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TextEditorModeEnum } from '../../../core/enums/text-editor-mode.enum';

@Component({
    selector: 'text-editor',
    templateUrl: 'text-editor.component.html',
})

export class TextEditorComponent implements OnInit {

    @Input() content: string;

    @Input() parentForm: FormGroup;

    @Input() controlForm: string;

    @Input() textEditorMode: TextEditorModeEnum;

    @Input() placeholder: string;

    @Output() contentChange = new EventEmitter();

    editorConfig = {};

    constructor() { }

    ngOnInit() {
        if (this.textEditorMode) {
            // liste des options dans la barre d'outils
            if (this.textEditorMode == TextEditorModeEnum.FULL) {
                this.editorConfig = {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'size': [] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['link']
                    ]
                };
            }
            if (this.textEditorMode == TextEditorModeEnum.LIGHT) {
                this.editorConfig = {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'font': [] }, { 'size': [] }],
                        [{ 'color': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['link']
                    ]
                };
            }
        }
    }
    /**
     * envoie le contenu du WYSIWYG au parent
     */
    broadcastContentChange() {
        this.contentChange.emit(this.content);
    }
}
