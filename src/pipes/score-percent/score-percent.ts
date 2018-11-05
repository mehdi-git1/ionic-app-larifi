import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { invalidPipeArgumentError } from '../invalid_pipe_argument_error';

@Pipe({
  name: 'scorePercent',
})
export class ScorePercentPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   * @param value The number to be formatted.
   * @param digitsInfo Decimal representation options, specified by a string
   * in the following format:<br>
   * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
   *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
   * Default is `1`.
   *   - `minFractionDigits`: The minimum number of digits after the decimal point.
   * Default is `0`.
   *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
   * Default is `3`.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   */
  transform(value: number) {
    if (this.isEmpty(value)) {
      return null;
    }

    try {
      const num = this.strToNumber(value);
    } catch (error) {
      throw invalidPipeArgumentError(ScorePercentPipe, error.message);
    }
    return Math.floor(value);
  }

  isEmpty(value: any): boolean {
    return value == null || value === '' || value !== value;
  }

  /**
 * Transforms a string into a number (if needed).
 */
strToNumber(value: number | string): number {
  // Convert strings to numbers
  if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
    return Number(value);
  }
  if (typeof value !== 'number') {
    throw new Error(`${value} is not a number`);
  }
  return value;
}
}
