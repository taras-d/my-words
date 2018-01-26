import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DBService } from './db.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DBService
  ],
  declarations: []
})
export class CoreModule { }
