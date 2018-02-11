import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GrowlModule } from 'primeng/growl';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

import { OpenExternalDirective } from './directives/open-external/open-external.directive';

import { LoaderComponent } from './components/loader/loader.component';

const primeNgModules = [
  TabMenuModule,
  CardModule,
  MessagesModule,
  TableModule,
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  InputTextModule,
  InputTextareaModule,
  GrowlModule,
  CheckboxModule,
  DropdownModule
];

const directives = [
  OpenExternalDirective
];

const components = [
  LoaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primeNgModules
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primeNgModules,
    ...directives,
    ...components
  ],
  declarations: [
    ...directives,
    ...components
  ]
})
export class SharedModule { }
