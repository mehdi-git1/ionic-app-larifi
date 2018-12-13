import { Pipe, PipeTransform } from '@angular/core';
import { TranslateOrEmptyService } from '../../../core/services/translate/translate-or-empty.service';

@Pipe({
  name: 'translateOrEmpty',
})
export class TranslateOrEmptyPipe implements PipeTransform {

  constructor(private translateOrEmptyService: TranslateOrEmptyService) {}

  /**
   * Traduit la clé ou renvoie vide si elle n'existe pas
   */
  transform(key: string, ...args) {
    return this.translateOrEmptyService.translate(key);
  }
}
