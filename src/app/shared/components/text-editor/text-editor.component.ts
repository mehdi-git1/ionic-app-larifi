

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TextEditorModeEnum } from '../../../core/enums/text-editor-mode.enum';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
    selector: 'text-editor',
    templateUrl: 'text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
    providers: [MakeProvider(TextEditorComponent)]
})

export class TextEditorComponent extends AbstractValueAccessor implements OnInit {

    @Input() parentForm: FormGroup;

    @Input() controlForm: string;

    @Input() mode = TextEditorModeEnum.LIGHT;

    @Input() placeholder: string;

    @Output() contentChange = new EventEmitter();

    TextEditorModeEnum = TextEditorModeEnum;


    editorConfig = {};

    constructor() {
        super();
    }

    ngOnInit() {
        // liste des options dans la barre d'outils
        if (this.mode == TextEditorModeEnum.FULL) {
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
        if (this.mode == TextEditorModeEnum.LIGHT) {
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
