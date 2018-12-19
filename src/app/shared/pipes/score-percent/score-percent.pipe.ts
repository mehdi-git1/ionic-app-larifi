import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { invalidPipeArgumentError } from '../invalid_pipe_argument_error.pipe';
import { Utils } from '../../utils/utils';

@Pipe({
  name: 'scorePercent',
})
export class ScorePercentPipe implements PipeTransform {

  constructor() {}

  /**
   * Formatte une chaîne de caractère au format à l'échelon inférieur
   * @param value la chaine de caractères à formatter
   * @param decimalDigits nombre de chiffres après la virgule
   * @return la valeur formattée
   */
  transform(value: string, decimalDigits:  number = 0) {
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
