import { HrDocumentModel } from './hr-document/hr-document.model';
import { PageModel } from './page.model';

export class PagedHrDocumentModel {
    content: HrDocumentModel[];
    page: PageModel;
}
