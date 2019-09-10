import { Component, Input } from '@angular/core';

@Component({
    selector: 'html-view',
    templateUrl: 'html-view.component.html',
})

export class HtmlViewComponent {

    @Input() content: string;

    editorConfig;

    constructor() {
        this.editorConfig = {
            toolbar: []
        };
    }
}
