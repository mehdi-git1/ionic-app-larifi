import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { Utils } from '../../utils/utils';
import { invalidPipeArgumentError } from '../invalid_pipe_argument_error.pipe';

@Pipe({
  name: 'scorePercent',
})
export class ScorePercentPipe implements PipeTransform {

  constructor() { }

  /**
   * Formatte une chaîne de caractère au format à l'échelon inférieur
   * @param value la chaine de caractères à formatter
   * @param decimalDigits nombre de chiffres après la virgule
   * @return la valeur formattée
   */
  transform(value: string, decimalDigits: number = 0) {
    if (value == '0') {
      return 0
    }
    if (!value || value == undefined) {
      return '';
    }
    if (decimalDigits < 0) {
      decimalDigits = 0;
    }
    const factor = Math.pow(10, decimalDigits);
    try {
      const num = this.strToNumber(value);
      return Math.floor(num * factor) / factor;
    } catch (error) {
      throw invalidPipeArgumentError(ScorePercentPipe, error.message);
    }
  }

  /**
   * Transforme un string en number. Si ce n'est pas formattable, on renvoie une exception
   * @param value valeur à transformer
   * @return number
   */
  strToNumber(value: number | string): number {
    if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
      return Number(value);
    }
    if (typeof value !== 'number') {
      throw new Error(`${value} is not a number`);
    }
    return value;
  }
}
