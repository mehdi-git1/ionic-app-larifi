import { TestBed } from '@angular/core/testing';

import { MyBoardNotificationService } from './my-board-notification.service';

describe('MyBoardNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyBoardNotificationService = TestBed.get(MyBoardNotificationService);
    expect(service).toBeTruthy();
  });
});
