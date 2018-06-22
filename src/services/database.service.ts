import { Config } from './../configuration/environment-variables/config';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {

  public CAREER_OBJECTIVE = 'CAREER_OBJECTIVE';
  public PNC = 'PNC';

  constructor(private sqlite: SQLite,
    private config: Config) {
  }

  createDB(): void {
    this.initDB().then(db => {
      this.createPncTable(db);
    });
  }

  initDB(): Promise<SQLiteObject> {
    return this.sqlite.create({
      name: this.config.dbName,
      location: 'default'
    });
  }

  createPncTable(db: SQLiteObject): Promise<SQLiteObject> {
    return db.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.PNC} (
        matricule TEXT PRIMARY KEY,
        offlineStorageDate TEXT,
        lastName TEXT,
        firstName TEXT,
        gender TEXT,
        speciality TEXT,
        manager INTEGER
      )`
      , {});
  }
}
