import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() readonly!: boolean;
  @Input() min!: string;
  isPassword!: boolean;
  hide: boolean = true;
  minDate: string;
  constructor() {
    this.minDate = this.getCurrentDate();
  }
  showOrHidePassword() {
    this.hide = !this.hide;
    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }
  getCurrentDate(): string {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return formattedDate;
  }
}
