import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceByPoint'
})
export class ReplaceByPointPipe implements PipeTransform {

    transform(value) {
        let valueReturn = '';
        if (typeof value !== 'undefined' && value !== '') {
            valueReturn = '<div class="selection-dot"></div>';
        }
        return valueReturn;
    }
}
