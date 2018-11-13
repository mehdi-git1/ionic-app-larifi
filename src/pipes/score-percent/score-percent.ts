import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { invalidPipeArgumentError } from '../invalid_pipe_argument_error';
import { Utils } from '../../common/utils/utils';

@Pipe({
  name: 'scorePercent',
})
export class ScorePercentPipe implements PipeTransform {

  constructor() {}

  /**
   * Formatte une chaîne de caractère au format 00.0
   * @param value la chaine de caractères à formatter
   * @return la valeur formattée
   */
  transform(value: string) {
    if (Utils.isEmpty(value)) {
      return null;
    }
    try {
      const num = this.strToNumber(value);
      return Math.floor(num * 10) / 10;
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
