import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';

import { ZipCodeService } from '../shared/services/zip-code.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  user: { name: string, email: string } = {
    name: '',
    email: ''
  };

  constructor(
    private _httpClient: HttpClient,
    private _zipCodeService: ZipCodeService
  ) { }

  submit(ngForm: NgForm): void {
    this._httpClient
      .post('https://httpbin.org/post', ngForm.value)
      .subscribe(data => {
        console.log(data);
        ngForm.form.reset();
      });
  }

  getAddressByZipCode(ngModel: NgModel, ngForm: NgForm): void {
    const zipCode = <string>ngModel.value;

    if (zipCode) {
      this._zipCodeService
        .getAddressByZipCode(zipCode)
        .subscribe(data => this.populateForm(data, ngForm));
    }
  }

  populateForm(data: any, ngForm: NgForm): void {
    // Using setValue

    // ngForm.setValue({
    //   name: ngForm.value.name,
    //   email: ngForm.value.email,
    //   address: {
    //     zipCode: data.cep,
    //     number: ngForm.value.number,
    //     complement: data.complemento,
    //     street: data.logradouro,
    //     district: data.bairro,
    //     city: data.localidade,
    //     state: data.uf
    //   }
    // });

    // Using patchValue

    ngForm.form.patchValue({
      address: {
        complement: data.complemento,
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf
      }
    });
  }

  resetForm(ngForm: NgForm): void {
    ngForm.form.patchValue({
      address: {
        complement: '',
        street: '',
        district: '',
        city: '',
        state: ''
      }
    });
  }

  isControlInvalid(control: NgModel): boolean {
    return (control.invalid && control.touched) ?? true;
  }

  getCssClassInvalid(control: NgModel): { [cssClass: string]: boolean } {
    return {
      'is-invalid': this.isControlInvalid(control)
    };
  }

}
