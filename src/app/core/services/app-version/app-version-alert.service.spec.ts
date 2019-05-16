import { EntityEnum } from '../../enums/entity.enum';
import { AppVersionModel } from '../../models/admin/app-version.model';
import { AppVersionAlertService } from './app-version-alert.service';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findOne', 'saveAsync']);
const appVersionTransformerServiceMock = jasmine.createSpyObj('appVersionTransformerServiceMock', ['toAppVersion']);

describe('AppVersionAlertService', () => {

  let appVersionAlertService: AppVersionAlertService;

  beforeEach(() => {
    appVersionAlertService = new AppVersionAlertService(sessionServiceMock, storageServiceMock, appVersionTransformerServiceMock);
  });


  describe('displayAppVersion', () => {

    it(`L'affichage de version doit être déclenché`, () => {

      // ARRANGE
      const appVersion = new AppVersionModel();
      const appVersionAlertCreationSpy = jasmine.createSpyObj('appVersionAlertCreationSpy', ['emit']);
      appVersionAlertService.appVersionAlertCreation = appVersionAlertCreationSpy;

      // ACT
      appVersionAlertService.displayAppVersion(appVersion);

      // ASSERT
      expect(appVersionAlertCreationSpy.emit).toHaveBeenCalledWith(appVersion);
    });
  });

  describe('isAppVersionToDisplay', () => {

    it(`Une version non présente en cache doit être affichée`, () => {

      // ARRANGE
      const appVersion = new AppVersionModel();
      appVersion.techId = 1;
      appVersion.number = '2.0.0';

      // ACT
      appVersionTransformerServiceMock.toAppVersion.and.returnValue(appVersion);
      storageServiceMock.findOne.and.returnValue(undefined);

      // ASSERT
      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);
      expect(result).toBeTruthy();
    });

    it(`Une version identique à celle présente en cache ne doit pas être affichée`, () => {

      // ARRANGE
      const appVersion = new AppVersionModel();
      appVersion.techId = 1;
      appVersion.number = '2.0.0';

      // ACT
      appVersionTransformerServiceMock.toAppVersion.and.returnValue(appVersion);
      storageServiceMock.findOne.and.returnValue(appVersion);

      // ASSERT
      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);
      expect(result).toBeFalsy();
    });
  });

  describe('doNotDisplayMessageAnymore', () => {

    it(`La version doit être stockée en cache si cette dernière ne doit plus être affichée`, () => {

      // ARRANGE
      const appVersion = new AppVersionModel();
      appVersion.techId = 1;
      appVersionTransformerServiceMock.toAppVersion.and.returnValue(appVersion);

      // ACT
      appVersionAlertService.doNotDisplayMessageAnymore(appVersion);

      // ASSERT
      expect(storageServiceMock.saveAsync).toHaveBeenCalledWith(EntityEnum.APP_VERSION, appVersion, true);
    });
  });
});
