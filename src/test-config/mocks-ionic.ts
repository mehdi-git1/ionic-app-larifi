import { of } from 'rxjs/observable/of';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

export class PlatformMock {
  public ready(): Promise<string> {
    return Promise.resolve('READY');
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return this.returnPromisePopPush();
  }

  public push(): any {
    return this.returnPromisePopPush();
  }

  public returnPromisePopPush() {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public get(id): any {
    return id;
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return;
  }

}

export class DeepLinkerMock { }

export class TranslateLoaderMock {
  public get(key: any): any {
    of(key);
  }

  public instant(key: any): any {
    return Promise.resolve(key);
  }
}

