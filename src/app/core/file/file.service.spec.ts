import { FileTypeEnum } from './../enums/file-type.enum';
import { FileService } from './file.service';

const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const pdfServiceMock = jasmine.createSpyObj('pdfServiceMock', ['displayPDF']);
const htmlServiceMock = jasmine.createSpyObj('htmlServiceMock', ['displayHTML']);
const fileTransferMock = jasmine.createSpyObj('fileTransferMock', []);
const toastServiceMock = jasmine.createSpyObj('toastServiceMock', []);
const fileMock = jasmine.createSpyObj('fileMock', []);
const fileOpenerMock = jasmine.createSpyObj('fileOpenerMock', []);
const inAppBrowserMock = jasmine.createSpyObj('inAppBrowserMock', []);
const httpClientMock = jasmine.createSpyObj('httpClientMock', []);
const translateServiceMock = jasmine.createSpyObj('translateServiceMock', []);

describe('file Service', () => {

    const fileService = new FileService(pdfServiceMock, htmlServiceMock, deviceServiceMock, fileTransferMock,
         toastServiceMock,
         fileMock,
         fileOpenerMock,
         inAppBrowserMock,
         httpClientMock, 
         translateServiceMock);

    describe('displayFile', () => {

        it('doit appeler la fonction displayHTML si on est en mode browser', () => {
            deviceServiceMock.isBrowser.and.returnValue(true);
            fileService.displayFile(FileTypeEnum.PDF, '');
            expect(htmlServiceMock.displayHTML).toHaveBeenCalled();
        });

        it('doit appeler la fonction displayHTML si on doit afficher une URL', () => {
            fileService.displayFile(FileTypeEnum.URL, '');
            expect(htmlServiceMock.displayHTML).toHaveBeenCalled();
        });

        it('doit appeler la fonction displayPDF si on doit afficher un fichier PDF', () => {
            deviceServiceMock.isBrowser.and.returnValue(false);
            fileService.displayFile(FileTypeEnum.PDF, '');
            expect(pdfServiceMock.displayPDF).toHaveBeenCalled();
        });
    });
});
