import { NotificationsService } from 'angular2-notifications';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { RestService } from './core/http/rest/rest.base.service';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy, restServiceSpy, routerSpy, modalControllerSpy, translateServiceSpy,
    storageSpy, notificationsServiceSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    restServiceSpy = jasmine.createSpyObj('RestService', { ready: restServiceSpy });
    routerSpy = jasmine.createSpyObj('Router', { ready: routerSpy });
    modalControllerSpy = jasmine.createSpyObj('ModalController', { ready: modalControllerSpy });
    translateServiceSpy = jasmine.createSpyObj('TranslateService', { ready: translateServiceSpy });
    storageSpy = jasmine.createSpyObj('Storage', { ready: storageSpy });
    notificationsServiceSpy = jasmine.createSpyObj('Storage', { ready: notificationsServiceSpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: RestService, useValue: restServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });


});
