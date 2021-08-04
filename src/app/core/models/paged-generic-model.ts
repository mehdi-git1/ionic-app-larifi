import { PageModel } from "./page.model";

export class PagedGenericModel<T> {
  content: T[];
  page: PageModel;
}
