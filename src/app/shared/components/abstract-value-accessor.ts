import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Cette classe abstraite permet aux custom component d'utiliser un ngModel
 */
export abstract class AbstractValueAccessor implements ControlValueAccessor {
    _value: any = null;
    get value(): any {
      return this._value;
    }
    set value(v: any) {
      if (v !== this._value) {
        this._value = v;
        this.onChange(v);
      }
    }

    writeValue(value: any) {
      this._value = value;
      this.onChange(value);
    }

    onChange = (_) => {};
    onTouched = () => {};
    registerOnChange(fn: (_: any) => void): void {
      this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
}

export function MakeProvider(type: any){
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}
