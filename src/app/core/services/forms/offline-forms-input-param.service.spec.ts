import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { OfflineFormsInputParamService } from './offline-forms-input-param.service';
import { EntityEnum } from '../../enums/entity.enum';
import { PncModel } from '../../models/pnc.model';
import { RotationModel } from '../../models/rotation.model';
import { LegModel } from '../../models/leg.model';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findOne', 'findAll']);

describe('OfflineFormsInputParamService', () => {

    let offlineFormsInputParamService: OfflineFormsInputParamService;

    const M123456 = 'm123456';
    const M223456 = 'm223456';
    const JBT0001 = 'JBT0001';
    const AF022 = '022';
    const AF023 = '023';
    const AF024 = '024';

    beforeEach(() => {
        offlineFormsInputParamService = new OfflineFormsInputParamService(storageServiceMock, sessionServiceMock);
    });

    beforeAll(() => {
        const authenticatedUser = new AuthenticatedUserModel();
        authenticatedUser.matricule = M123456;
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);

        const redactor = new PncModel();
        redactor.matricule = M123456;

        const observedPnc = new PncModel();
        observedPnc.matricule = M223456;

        const rotation = new RotationModel();
        rotation.number = JBT0001;

        storageServiceMock.findOne.and.callFake((entityType, matricule) => {
            if (entityType === EntityEnum.PNC && matricule === M123456) {
                return redactor;
            } else if (entityType === EntityEnum.PNC && matricule === M223456) {
                return observedPnc;
            } else if (entityType === EntityEnum.ROTATION) {
                return rotation;
            }
        });

        const leg1 = new LegModel();
        leg1.number = AF022;
        leg1.departureDate = '2014-02-29T10:00:00';
        const leg2 = new LegModel();
        leg2.number = AF023;
        leg1.departureDate = '2014-02-25T10:00:00';
        const leg3 = new LegModel();
        leg3.number = AF024;
        leg1.departureDate = '2014-02-27T10:00:00';
        const rotationLegs = new Array<LegModel>();
        rotationLegs.push(leg1);
        rotationLegs.push(leg2);
        rotationLegs.push(leg3);
        storageServiceMock.findAll.and.returnValue(rotationLegs);
    });

    describe(`getFormsInputParams`, () => {

        it(`doit retourner un objet complet exploitable par eForms`, () => {
            offlineFormsInputParamService.getFormsInputParams(M123456, 1).then(formsInputParam => {
                expect(formsInputParam.observedPnc.matricule).toBe(M223456);
                expect(formsInputParam.redactor.matricule).toBe(M123456);
                expect(formsInputParam.rotation.number).toBe(JBT0001);
                expect(formsInputParam.rotationFirstLeg.number).toBe(AF023);
                expect(formsInputParam.rotationLastLeg.number).toBe(AF022);
            });
        });
    });
});
