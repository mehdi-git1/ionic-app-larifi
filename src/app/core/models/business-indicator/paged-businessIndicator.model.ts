import { PageModel } from './../page.model';
import { BusinessIndicatorModel } from './business-indicator.model';

export class PagedBusinessIndicatorModel {
    content: BusinessIndicatorModel[];
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
}
