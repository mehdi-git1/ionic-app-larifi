import { EntityEnum } from '../../enums/entity.enum';
import { AppVersionModel } from '../../models/admin/app-version.model';
import { AppVersionAlertService } from './app-version-alert.service';
import * as moment from 'moment';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findOne', 'saveAsync']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const appVersionTransformerServiceMock = jasmine.createSpyObj('appVersionTransformerServiceMock', ['toAppVersion']);

describe('AppVersionAlertService', () => {

  let appVersionAlertService: AppVersionAlertService;

  beforeEach(() => {
    appVersionAlertService = new AppVersionAlertService(sessionServiceMock, storageServiceMock, appVersionTransformerServiceMock, deviceServiceMock);
  });


  describe('displayAppVersion', () => {

    it(`L'affichage du message doit être déclenché`, () => {
      const appVersion = new AppVersionModel();
      const appVersionAlertCreationSpy = jasmine.createSpyObj('appVersionAlertCreationSpy', ['emit']);
      appVersionAlertService.appVersionAlertCreation = appVersionAlertCreationSpy;

      appVersionAlertService.displayAppVersion(appVersion);

      expect(appVersionAlertCreationSpy.emit).toHaveBeenCalledWith(appVersion);
    });
  });

  describe('isAppVersionToDisplay', () => {

    it(`Le message utilisateur ne devrait pas être affiché en mode web`, () => {
      const appVersion = new AppVersionModel();
      deviceServiceMock.isBrowser.and.returnValue(true);

      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);

      expect(result).toBeFalsy();
    });

    it(`Un message utilisateur non présent en cache doit être affiché`, () => {
      const appVersion = new AppVersionModel();
      deviceServiceMock.isBrowser.and.returnValue(false);
      storageServiceMock.findOne.and.returnValue(undefined);

      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);

      expect(result).toBeTruthy();
    });

    it(`Un message utilisateur plus récent que celui présent en cache doit être affiché`, () => {
      const appVersion = new AppVersionModel();
      appVersion.lastUpdateDate = moment().toDate();
      deviceServiceMock.isBrowser.and.returnValue(false);
      const storedAppVersion = new AppVersionModel();
      storedAppVersion.lastUpdateDate = moment().subtract(1, 'hours').toDate();
      storageServiceMock.findOne.and.returnValue(storedAppVersion);

      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);

      expect(result).toBeTruthy();
    });

    it(`Un message utilisateur plus ancien ou identique à celui présent en cache ne doit pas être affiché`, () => {
      const appVersion = new AppVersionModel();
      appVersion.lastUpdateDate = moment().toDate();
      deviceServiceMock.isBrowser.and.returnValue(false);
      const storedAppVersion = new AppVersionModel();
      storedAppVersion.lastUpdateDate = appVersion.lastUpdateDate;
      storageServiceMock.findOne.and.returnValue(storedAppVersion);

      const result = appVersionAlertService['isAppVersionToDisplay'](appVersion);

      expect(result).toBeFalsy();
    });
  });

  describe('doNotDisplayMessageAnymore', () => {

    it(`Le message utilisateur doit être stocké en cache si ce dernier ne doit plus être affiché`, () => {
      const appVersion = new AppVersionModel();
      appVersion.key = AppVersionKeyEnum.INSTRUCTOR_MESSAGE;
      appVersionTransformerServiceMock.toAppVersion.and.returnValue(appVersion);

      appVersionAlertService.doNotDisplayMessageAnymore(appVersion);

      expect(storageServiceMock.saveAsync).toHaveBeenCalledWith(EntityEnum.USER_MESSAGE, appVersion, true);
    });
  });

});
