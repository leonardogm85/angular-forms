import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidators {

  static checkedAtLeast(min: number = 1): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const frameworksChecked = (formArray as FormArray).controls
        .map(control => control.value as boolean)
        .reduce((previousValue: number, currentValue: boolean) => {
          return currentValue
            ? previousValue + 1
            : previousValue
        }, 0);
      return frameworksChecked >= min
        ? null
        : { checkedatleast: { requiredAtLeast: min } };
    };
  }

  static zipCode(formControl: AbstractControl): ValidationErrors | null {
      const value = formControl.value as string;

      if (value) {
        return /^[0-9]{8}$/.test(value)
          ? null
          : { zipcode: true }
      }

      return null;
  }

  static equalsTo(otherControl: string): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      if (!otherControl) {
        throw new Error('Other control is required.');
      }

      if (!formControl.root || !(formControl.root as FormGroup).controls) {
        return null;
      }

      const control = formControl.root.get(otherControl);

      if (!control) {
        throw new Error('Other control is invalid.');
      }

      return control.value === formControl.value
        ? null
        : { equalsto: { otherControl: otherControl } };
    };
  }

  static getErrorMessage(controlName: string, validatorName: string, validatorValue?: any): string {
    const config: { [key: string]: string } = {
      'required': `${controlName} is required.`,
      'minlength': `${controlName} must have a minimum of ${validatorValue.requiredLength} characters.`,
      'maxlength': `${controlName} must have a maximum of ${validatorValue.requiredLength} characters.`,
      'email': `${controlName} is invalid.`,
      'zipcode': `${controlName} is invalid.`,
      'emailexists': `${controlName} aready exists.`,
      'equalsto': `${controlName} must be equals to ${validatorValue.otherControl}.`,
      'requiredtrue': `${controlName} must be checked.`,
      'checkedatleast': `${controlName} must have a minimum of ${validatorValue.requiredAtLeast} items checked.`
    };
    return config[validatorName];
  }

}
