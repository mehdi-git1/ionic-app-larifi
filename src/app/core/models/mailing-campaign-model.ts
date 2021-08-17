import { DocumentModel } from './document.model';

export class MailingCampaignModel {
  from: string;
  subject: string;
  content: string;
  ccIrecipients: Array<string>;
  ccRecipients: Array<string>;
  attachmentFiles: Array<DocumentModel> = new Array();
}
