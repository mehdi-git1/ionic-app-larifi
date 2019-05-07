export enum LogbookCategoryEnum {
    'SECTOR_EXCHANGES' = 'Echanges secteurs',
    'REX' = 'Retours écrit / REX'
}
export namespace LogbookCategoryEnum {

    export function values() {
      return Object.keys(LogbookCategoryEnum).filter(
        (category) => isNaN(<any>category) && category !== 'values'
      );
    }
  }
