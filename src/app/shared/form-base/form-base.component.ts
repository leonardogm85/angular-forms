import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

export abstract class FormBaseComponent {

  form!: FormGroup;

  abstract submit(): void;

  onSubmit(): void {
    if (this.form.valid) {
      this.submit();
    } else {
      this.validateForm(this.form);
    }
  }

  validateForm(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateForm(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    this.form.reset();
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (control?.invalid && control?.touched) ?? false;
  }

  getCssClassInvalid(controlName: string): { [cssClass: string]: boolean } {
    return {
      'is-invalid': this.isControlInvalid(controlName)
    };
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

}
