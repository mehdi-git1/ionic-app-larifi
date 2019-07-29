import { Component, Input } from '@angular/core';

@Component({
    selector: 'read-only',
    templateUrl: 'text-editor-read-only.component.html',
})

export class TextEditorReadOnlyComponent {

    @Input() content: string;

    editorConfig;

    constructor() {
        this.editorConfig = {
            toolbar: []
        };
    }
}
