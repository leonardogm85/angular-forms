import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

import { FormValidators } from '../FormValidators';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {

  @Input() control?: AbstractControl | null;
  @Input() label?: string | null;

  get errorMessage(): string | null {
    for (const propertyName in this.control?.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return FormValidators.getErrorMessage(this.label!, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

}
