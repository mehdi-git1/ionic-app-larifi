import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DocumentManagerComponent } from './document-manager.component';
import { DocumentTypeEnum } from '../../../core/models/document.model';

describe('documentManager', () => {

    let fixture: ComponentFixture<DocumentManagerComponent>;
    let documentManagerComponent: DocumentManagerComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
              DocumentManagerComponent
            ],
            imports: [
                IonicModule.forRoot(DocumentManagerComponent)
            ],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DocumentManagerComponent);
        documentManagerComponent = fixture.componentInstance;
    });

    describe('getFileTypeFromFile', () => {
      it(`doit ramener IMAGE si le fichier est de type image`, () => {
        let arrayOfBlob = new Array<Blob>();
        let file = new File( arrayOfBlob, 'test-file.jpg', { type: 'image/jpeg'});
        const fileType = documentManagerComponent.getFileTypeFromFile(file);
        expect(fileType).toBe(DocumentTypeEnum.IMAGE);
      });

      it(`doit ramener PDF si le fichier est de type pdf`, () => {
        let arrayOfBlob = new Array<Blob>();
        let file = new File( arrayOfBlob, 'test-file.pdf', { type: 'application/pdf'});
        const fileType = documentManagerComponent.getFileTypeFromFile(file);
        expect(fileType).toBe(DocumentTypeEnum.IMAGE);
      });

      it(`doit ramener OTHER si le fichier est ni de type pdf ni de type image`, () => {
        let arrayOfBlob = new Array<Blob>();
        let file = new File( arrayOfBlob, 'test-file.zip', { type: 'application/zip'});
        const fileType = documentManagerComponent.getFileTypeFromFile(file);
        expect(fileType).toBe(DocumentTypeEnum.IMAGE);
      });
    });

});