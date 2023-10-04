import { Component, Input, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
};

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() cssClass?: { [key: string]: any } | null;
  @Input() id?: string | null;
  @Input() label?: string | null;
  @Input() control?: AbstractControl | null;
  @Input() type: string = 'text';
  @Input() isReadOnly: boolean = false;

  private _value: any;

  get value(): any {
    return this._value;
  }

  set value(newValue: any) {
    if (newValue !== this._value) {
      this._value = newValue;
      this.onChange(newValue);
    }
  }

  onChange: (_: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(newValue: any): void {
    this.value = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }

}
