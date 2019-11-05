

import { Config } from '../../../../environments/config';
import { DocumentTypeEnum } from '../../../core/models/document.model';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { DocumentService } from './document.service';

const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);

describe('documentManager', () => {

    let documentService: DocumentService;

    beforeEach(() => {
      documentService = new DocumentService(restServiceMock,new UrlConfiguration(new Config()));
    });

    describe('getDocumentTypeFromMimeType', () => {
      it(`doit ramener IMAGE si le fichier est de type image`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getDocumentTypeFromMimeType('image/jpeg');
        expect(fileType).toBe(DocumentTypeEnum.IMAGE);
      });

      it(`doit ramener PDF si le fichier est de type pdf`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getDocumentTypeFromMimeType('application/pdf');
        expect(fileType).toBe(DocumentTypeEnum.PDF);
      });

      it(`doit ramener OTHER si le fichier n'est pas d'un type géré par l'application`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getDocumentTypeFromMimeType('application/zip');
        expect(fileType).toBe(DocumentTypeEnum.OTHER);
      });
    });

});