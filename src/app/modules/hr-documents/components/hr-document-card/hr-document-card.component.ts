import { Component, Input, OnInit } from '@angular/core';

import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
})
export class HrDocumentCardComponent {

    @Input() hrDocument: HrDocumentModel;

    TextEditorModeEnum = TextEditorModeEnum;
}
