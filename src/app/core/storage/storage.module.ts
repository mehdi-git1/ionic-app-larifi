import { NgModule } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { StorageService } from './storage.service';

@NgModule({
  imports: [
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  exports: [],
  providers: [
    StorageService,
    SQLite
  ]
})

export class StorageModule { }

