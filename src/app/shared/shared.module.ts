import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { CheckboxModule, Checkbox } from 'primeng/checkbox';

import { OpenInGTDirective } from './directives/open-in-gt/open-in-gt.directive';

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
  CheckboxModule
];

const directives = [
  OpenInGTDirective
];

const components = [
  LoaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ...primeNgModules
  ],
  exports: [
    CommonModule,
    FormsModule,
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
