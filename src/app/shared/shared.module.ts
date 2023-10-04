import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DebugFormComponent } from './debug-form/debug-form.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { InputFieldComponent } from './input-field/input-field.component';

@NgModule({
  declarations: [
    DebugFormComponent,
    ErrorMessageComponent,
    InputFieldComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    DebugFormComponent,
    ErrorMessageComponent,
    InputFieldComponent
  ]
})
export class SharedModule { }
