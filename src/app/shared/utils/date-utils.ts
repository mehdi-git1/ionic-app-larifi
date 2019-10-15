import { Injectable } from '@angular/core';

@Injectable()
export class DateUtils {

    /**
     * Ajoute un nombre de jours a la date en entrée
     * @param date la date concernée
     * @param days le nombre de jours
     * @return la date résultante
     */
    public static addDays(date: Date, days: number): Date {
        if (!days || !(date instanceof Date)) {
            return date;
        }
        date.setDate(date.getDate() + days);
        return date;
    }


}
