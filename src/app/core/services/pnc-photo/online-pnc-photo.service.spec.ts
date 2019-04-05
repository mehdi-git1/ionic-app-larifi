import { AppConstant } from './../../../app.constant';
import { OnlinePncPhotoService } from './online-pnc-photo.service';
import { PncPhotoModel } from './../../models/pnc-photo.model';
import { fakeAsync } from '@angular/core/testing';
import * as moment from 'moment';

const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);
const offlinePncPhotoServiceMock = jasmine.createSpyObj('offlinePncPhotoServiceMock', ['getPncPhoto'])
const pncPhotoTransformerMock = jasmine.createSpyObj('pncPhotoTransformerMock', ['toPncPhoto'])
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);
const configMock = jasmine.createSpyObj('configMock', ['getBackEndUrl']);
const eventsMock = jasmine.createSpyObj('eventsMock', ['emit']);

describe('onlinePncPhotoService', () => {

    let onlinePncPhotoService: OnlinePncPhotoService;

    beforeEach(() => {
        onlinePncPhotoService = new OnlinePncPhotoService(restServiceMock, offlinePncPhotoServiceMock, storageServiceMock, pncPhotoTransformerMock, configMock, eventsMock);
    });

    beforeEach(() => {

    });

    describe('photoIsExpired', () => {

        it('doit retourner faux si la photo est encore valide (mise en cache il y a moins de 24h)', fakeAsync(() => {
            const pncPhoto = new PncPhotoModel();
            pncPhoto.offlineStorageDate = moment().subtract(23, 'hours').format(AppConstant.isoDateFormat);

            const result = onlinePncPhotoService['photoIsExpired'](pncPhoto);

            expect(result).toBeFalsy();
        }));

        it('doit retourner vrai si la photo est expirée (mise en cache il y a plus de 24h)', fakeAsync(() => {
            const pncPhoto = new PncPhotoModel();
            pncPhoto.offlineStorageDate = moment().subtract(25, 'hours').format(AppConstant.isoDateFormat);

            const result = onlinePncPhotoService['photoIsExpired'](pncPhoto);

            expect(result).toBeTruthy();
        }));
    });



});
