import { DatabaseService } from './../../services/database.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflinePncProvider {

  constructor(private db: DatabaseService) {
  }

  save(pnc: Pnc): void {
    this.db.initDB().then(db => {
      db.executeSql(`INSERT INTO ${this.db.PNC} values(?,?,?,?,?,?,?)`,
        [pnc.matricule, pnc.offlineStorageDate, pnc.lastName, pnc.firstName, pnc.gender, pnc.speciality, pnc.manager]);
    });
  }

  findOne(matricule: string): Promise<Pnc> {
    return new Promise((resolve, reject) => {
      this.db.initDB().then(db => {
        db.executeSql(`SELECT * FROM ${this.db.PNC} WHERE matricule = ?`,
          [matricule]).then(pnc => {
            resolve(pnc);
          });
      });
    });
  }

}
