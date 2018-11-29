import { FileTypeEnum } from './../enums/file-type.enum';
import { FileService } from './file.service';

const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const pdfServiceMock = jasmine.createSpyObj('pdfServiceMock', ['displayPDF']);
const htmlServiceMock = jasmine.createSpyObj('pdfServiceMock', ['displayHTML']);

describe('file Service', () => {

    const fileService = new FileService(pdfServiceMock, htmlServiceMock, deviceServiceMock);

    describe('displayFile', () => {

        it('doit appeler la fonction displayHTML si on est en mode browser', () => {
            deviceServiceMock.isBrowser.and.returnValue(true);
            fileService.displayFile(FileTypeEnum.PDF, '');
            expect(htmlServiceMock.displayHTML).toHaveBeenCalled();
        });

        it('doit appeler la fonction displayHTML si souhaite affficher une URL', () => {
            fileService.displayFile(FileTypeEnum.URL, '');
            expect(htmlServiceMock.displayHTML).toHaveBeenCalled();
        });

        it('doit appeler la fonction displayPDF si souhaite affficher un fichier PDF', () => {
            deviceServiceMock.isBrowser.and.returnValue(false);
            fileService.displayFile(FileTypeEnum.PDF, '');
            expect(pdfServiceMock.displayPDF).toHaveBeenCalled();
        });
    });
});
