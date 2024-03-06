import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;
  @Input() cartButton!: boolean;
  @Input() admin!: boolean;
  constructor(private modalCtrl: ModalController) {}
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
