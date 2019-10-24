import { Component, Input, OnInit } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
})
export class HrDocumentCardComponent implements OnInit {

    @Input() hrDocument: HrDocumentModel;

    @Input() mode: HrDocumentModeEnum;

    TextEditorModeEnum = TextEditorModeEnum;

    constructor() {
    }

    ngOnInit() {
    }
}
