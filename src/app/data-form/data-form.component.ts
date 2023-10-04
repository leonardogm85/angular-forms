import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';

import { EMPTY, Observable, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { DropdownService } from '../shared/services/dropdown.service';
import { State } from '../shared/models/state.model';
import { ZipCodeService } from '../shared/services/zip-code.service';
import { Position } from '../shared/models/position.model';
import { Tecnology } from '../shared/models/tecnology.model';
import { Newsletter } from '../shared/models/newsletter.model';
import { FormValidators } from '../shared/FormValidators';
import { VerifyEmailService } from './services/verify-email.service';
import { FormBaseComponent } from '../shared/form-base/form-base.component';
import { City } from '../shared/models/city.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends FormBaseComponent implements OnInit {

  // Without Observable
  states?: State[];

  // With Observable
  // states?: Observable<State[]>;

  cities?: City[];
  positions?: Position[];
  tecnologies?: Tecnology[];
  newsletters?: Newsletter[];
  frameworks?: string[];

  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    private _dropdownService: DropdownService,
    private _zipCodeService: ZipCodeService,
    private _verifyEmailService: VerifyEmailService
  ) {
    super();
  }

  ngOnInit(): void {
    // Using FormGroup
    // this.form = new FormGroup({
    //   name: new FormControl(),
    //   email: new FormControl()
    // });

    // Using FormBuilder
    // this.form = this._formBuilder.group({
    //   name: [''],
    //   email: ['']
    // });

    this.form = this._formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.email], [this.emailExists.bind(this)]],
      confirmEmail: [null, [FormValidators.equalsTo('email')]],
      address: this._formBuilder.group({
        zipCode: [null, [Validators.required, FormValidators.zipCode]],
        number: [null, Validators.required],
        complement: [null],
        street: [null, Validators.required],
        district: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required]
      }),
      position: [null],
      tecnologies: [null],
      newsletter: ['y'],
      terms: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks()
    });

    // Without Observable
    this._dropdownService.getStates().subscribe(data => {
      this.states = data;
    });

    // With Observable
    // this.states = this._dropdownService.getStates();

    this.positions = this._dropdownService.getPositions();
    this.tecnologies = this._dropdownService.getTechnologies();
    this.newsletters = this._dropdownService.getNewsletters();
    this.frameworks = this._dropdownService.getFrameworks();

    this.form.get('address.zipCode')?.statusChanges.pipe(
      distinctUntilChanged(),
      tap(console.log),
      switchMap(status => {
        return status === 'VALID'
          ? this._zipCodeService.getAddressByZipCode(<string>this.form.get('address.zipCode')?.value)
          : EMPTY
      })
    ).subscribe(data => {
      if (data) {
        this.populateForm(data);
      }
    });

    this.form.get('address.state')?.valueChanges.pipe(
      tap(console.log),
      map((newState: string) => (this.states ?? []).filter((state: State) => state.abbreviation === newState)),
      map((states: State[]) => states && states.length > 0 ? states[0].id : null),
      switchMap((id: number | null, index: number) => {
        if (id) {
          return this._dropdownService.getCities(id);
        }
        return EMPTY;
      }),
      tap(console.log)
    ).subscribe(newCities => {
      this.cities = newCities;
    });
  }

  submit(): void {
    const formValues = Object.assign(this.form.value, {
      frameworks: (this.form.value.frameworks as boolean[])
      .reduce((previousValue: string[], currentValue: boolean, currentIndex: number)=> {
        return currentValue
          ? [...previousValue, this.frameworks![currentIndex]]
          : previousValue
      }, [])
    });

    console.log(formValues);

    this._httpClient
      .post('https://httpbin.org/post', formValues)
      .subscribe({
        next: v => {
          console.log(v);
        },
        error: e => {
          console.log(e);
          alert('Error');
        }
      });
  }

  getAddressByZipCode(): void {
    const zipCode = <string>this.form.get('address.zipCode')?.value;

    if (zipCode) {
      this._zipCodeService
        .getAddressByZipCode(zipCode)
        .subscribe(data => this.populateForm(data));
    }
  }

  populateForm(data: any): void {
    this.form.patchValue({
      address: {
        complement: data.complemento,
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf
      }
    });
  }

  resetForm(): void {
    this.form.patchValue({
      address: {
        complement: '',
        street: '',
        district: '',
        city: '',
        state: ''
      }
    });
  }

  setPosition(): void {
    const position: Position = {
      name: 'Developer',
      level: 'Senior',
      description: 'Senior developer'
    };
    this.form.get('position')?.setValue(position);
  }

  setTecnologies(): void {
    this.form.get('tecnologies')?.setValue([2, 3, 5]);
  }

  comparePositions(p1: Position, p2: Position): boolean {
    return p1 && p2
      ? p1.name === p2.name && p1.level === p2.level
      : p1 === p2;
  }

  buildFrameworks(): FormArray {
    const controls: FormControl[] = this
      ._dropdownService
      .getFrameworks()
      .map(framework => this._formBuilder.control(false));
    return this._formBuilder.array(controls, FormValidators.checkedAtLeast(1));
  }

  getFrameworksControls(): AbstractControl[] {
    return (this.form.get('frameworks') as FormArray).controls;
  }

  emailExists(formControl: AbstractControl): ValidationErrors | null {
    return this._verifyEmailService.verifyEmail(formControl.value).pipe(
      map((emailExists: Boolean) => {
        return emailExists
          ? { emailexists: true }
          : null
      })
    );
  }

}
