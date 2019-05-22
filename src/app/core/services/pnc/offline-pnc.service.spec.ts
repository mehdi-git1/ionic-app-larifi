import { OfflinePncService } from './offline-pnc.service';
import { fakeAsync } from '@angular/core/testing';
import { PncModel } from '../../models/pnc.model';
import { AssignmentModel } from '../../models/assignment.model';
import { RotationModel } from '../../models/rotation.model';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll', 'findOneAsync', 'findAllAsync']);
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);

describe('OfflinePncService', () => {

    let offlinePncService: OfflinePncService;
    let pncArray: Array<PncModel>;
    let rotationsArray: Array<RotationModel>;

    const M123456 = 'm123456';
    const M223456 = 'm223456';

    beforeEach(() => {
        offlinePncService = new OfflinePncService(storageServiceMock, sessionServiceMock);
    });

    describe('getFilteredPncs', () => {

        beforeEach(() => {
            pncArray = [new PncModel(), new PncModel(), new PncModel()];
            pncArray[0].matricule = '778877';
            pncArray[0].assignment = new AssignmentModel();
            pncArray[1].matricule = '778866';
            pncArray[1].assignment = new AssignmentModel();
            pncArray[1].assignment.division = 'DIV';
            pncArray[1].assignment.sector = 'SEC';
            pncArray[2].matricule = '778800';
            pncArray[2].assignment = new AssignmentModel();
            pncArray[2].assignment.division = 'DIV';
            pncArray[2].assignment.sector = 'SC';
            sessionServiceMock.getActiveUser.and.returnValue(pncArray[0]);
            storageServiceMock.findOneAsync.and.returnValue(Promise.resolve(pncArray[0]));
            storageServiceMock.findAllAsync.and.returnValue(Promise.resolve(pncArray));
        });

        it('doit retourner tous les PNCs avec le pnc actuellement connecté => 778877 en mode ADM', fakeAsync(() => {
            pncArray[0].assignment.division = 'ADM';
            offlinePncService.getFilteredPncs().then(
                pncs => {
                    expect(pncs.content.length).toBe(3);
                    expect(pncs.page.size).toBe(pncs.content.length);
                    expect(pncs.page.totalElements).toBe(pncs.content.length);
                    expect(pncs.page.number).toBe(0);
                }
            );
        }));

        it('doit retourner le PNC en Division=> DIV et section => SEC avec le pnc actuellement connecté => 778877', fakeAsync(() => {
            pncArray[0].assignment.division = 'DIV';
            pncArray[0].assignment.sector = 'SEC';
            offlinePncService.getFilteredPncs().then(
                pncs => {
                    expect(pncs.content.length).toBe(1);
                    expect(pncs.content[0].matricule).toBe('778866');
                    expect(pncs.page.size).toBe(pncs.content.length);
                    expect(pncs.page.totalElements).toBe(pncs.content.length);
                    expect(pncs.page.number).toBe(0);
                }
            );
        }));

    });

    describe('getAllRotationsByMatricule', () => {

        beforeEach(() => {
            rotationsArray = [new RotationModel(), new RotationModel(), new RotationModel()];
        });

        it(`On devrait avoir 3 rotations en cache`, fakeAsync(() => {
            storageServiceMock.findAll.and.returnValue(rotationsArray);

            offlinePncService.getAllRotationsByMatricule(null).then(
                upcomingRotations => {
                    expect(upcomingRotations.length).toBe(3);
                }
            );
        }));
    });
});
