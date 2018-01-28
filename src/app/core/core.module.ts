import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/components/common/messageservice';

import { DBService } from './db.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DBService,
    MessageService
  ],
  declarations: []
})
export class CoreModule { }
