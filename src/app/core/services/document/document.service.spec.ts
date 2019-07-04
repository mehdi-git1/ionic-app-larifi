import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DocumentTypeEnum } from '../../../core/models/document.model';
import { Config } from '../../../../environments/config';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { DocumentService } from './document.service';

const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);

describe('documentManager', () => {

    let documentService: DocumentService;

    beforeEach(() => {
      documentService = new DocumentService(restServiceMock,new UrlConfiguration(new Config()));
    });

    describe('getFileTypeFromFile', () => {
      it(`doit ramener IMAGE si le fichier est de type image`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getFileTypeFromFile('image/jpeg');
        expect(fileType).toBe(DocumentTypeEnum.IMAGE);
      });

      it(`doit ramener PDF si le fichier est de type pdf`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getFileTypeFromFile('application/pdf');
        expect(fileType).toBe(DocumentTypeEnum.PDF);
      });

      it(`doit ramener OTHER si le fichier n'est pas d'un type géré par l'application`, () => {
        const arrayOfBlob = new Array<Blob>();
        const fileType = documentService.getFileTypeFromFile('application/zip');
        expect(fileType).toBe(DocumentTypeEnum.OTHER);
      });
    });

});