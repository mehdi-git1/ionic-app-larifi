import { EntityEnum } from './../../enums/entity.enum';
import { UserMessageModel } from './../../models/admin/user-message.model';
import { UserMessageAlertService } from './user-message-alert.service';
import * as moment from 'moment';
import { UserMessageKeyEnum } from '../../enums/admin/user-message-key.enum';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findOne', 'saveAsync']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const userMessageTransformerServiceMock = jasmine.createSpyObj('userMessageTransformerServiceMock', ['toUserMessage']);

describe('UserMessageAlertService', () => {

    let userMessageAlertService: UserMessageAlertService;

    beforeEach(() => {
        userMessageAlertService = new UserMessageAlertService(sessionServiceMock, storageServiceMock, userMessageTransformerServiceMock, deviceServiceMock);
    });


    describe('displayUserMessage', () => {

        it(`L'affichage du message doit être déclenché`, () => {
            const userMessage = new UserMessageModel();
            const userMessageAlertCreationSpy = jasmine.createSpyObj('userMessageAlertCreationSpy', ['emit']);
            userMessageAlertService.userMessageAlertCreation = userMessageAlertCreationSpy;

            userMessageAlertService.displayUserMessage(userMessage);

            expect(userMessageAlertCreationSpy.emit).toHaveBeenCalledWith(userMessage);
        });
    });

    describe('isUserMessageToDisplay', () => {

        it(`Le message utilisateur ne devrait pas être affiché en mode web`, () => {
            const userMessage = new UserMessageModel();
            deviceServiceMock.isBrowser.and.returnValue(true);

            const result = userMessageAlertService['isUserMessageToDisplay'](userMessage);

            expect(result).toBeFalsy();
        });

        it(`Un message utilisateur non présent en cache doit être affiché`, () => {
            const userMessage = new UserMessageModel();
            deviceServiceMock.isBrowser.and.returnValue(false);
            storageServiceMock.findOne.and.returnValue(undefined);

            const result = userMessageAlertService['isUserMessageToDisplay'](userMessage);

            expect(result).toBeTruthy();
        });

        it(`Un message utilisateur plus récent que celui présent en cache doit être affiché`, () => {
            const userMessage = new UserMessageModel();
            userMessage.lastUpdateDate = moment().toDate();
            deviceServiceMock.isBrowser.and.returnValue(false);
            const storedUserMessage = new UserMessageModel();
            storedUserMessage.lastUpdateDate = moment().subtract(1, 'hours').toDate();
            storageServiceMock.findOne.and.returnValue(storedUserMessage);

            const result = userMessageAlertService['isUserMessageToDisplay'](userMessage);

            expect(result).toBeTruthy();
        });

        it(`Un message utilisateur plus ancien ou identique à celui présent en cache ne doit pas être affiché`, () => {
            const userMessage = new UserMessageModel();
            userMessage.lastUpdateDate = moment().toDate();
            deviceServiceMock.isBrowser.and.returnValue(false);
            const storedUserMessage = new UserMessageModel();
            storedUserMessage.lastUpdateDate = userMessage.lastUpdateDate;
            storageServiceMock.findOne.and.returnValue(storedUserMessage);

            const result = userMessageAlertService['isUserMessageToDisplay'](userMessage);

            expect(result).toBeFalsy();
        });
    });

    describe('doNotDisplayMessageAnymore', () => {

        it(`Le message utilisateur doit être stocké en cache si ce dernier ne doit plus être affiché`, () => {
            const userMessage = new UserMessageModel();
            userMessage.key = UserMessageKeyEnum.INSTRUCTOR_MESSAGE;
            userMessageTransformerServiceMock.toUserMessage.and.returnValue(userMessage);

            userMessageAlertService.doNotDisplayMessageAnymore(userMessage);

            expect(storageServiceMock.saveAsync).toHaveBeenCalledWith(EntityEnum.USER_MESSAGE, userMessage, true);
        });
    });

});
