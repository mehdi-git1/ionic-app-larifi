import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { invalidPipeArgumentError } from '../invalid_pipe_argument_error';

@Pipe({
  name: 'scorePercent',
})
export class ScorePercentPipe implements PipeTransform {

  constructor() {}

  /**
   * @param value la chaine de caractères à formatter
   * @return la valeur formattée
   */
  transform(value: string) {
    if (this.isEmpty(value)) {
      return null;
    }

    try {
      const num = this.strToNumber(value);
      return Math.floor(num);
    } catch (error) {
      throw invalidPipeArgumentError(ScorePercentPipe, error.message);
    }

  }

  isEmpty(value: any): boolean {
    return value == null || value === '' || value !== value;
  }

  /**
   * Transforme UN string en number
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
