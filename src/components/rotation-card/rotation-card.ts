import { RotationProvider } from './../../providers/rotation/rotation';
import { Rotation } from './../../models/rotation';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'rotation-card',
  templateUrl: 'rotation-card.html'
})
export class RotationCardComponent {

  @Input() rotation: Rotation;

  constructor(private rotationProvider: RotationProvider) {
  }

  /**
  * Ouvre/ferme une rotation et récupère la liste des tronçons si elle est ouverte
  * @param rotation La rotation à ouvrir/fermer
  */
  toggleRotation(rotation: Rotation) {
    rotation.opened = !rotation.opened;
    if (rotation.opened) {
      rotation.loading = true;
      this.rotationProvider.getRotationLegs(rotation).then(rotationLegs => {
        rotation.legs = rotationLegs;
        rotation.loading = false;
      }, error => {
        rotation.loading = false;
      });
    }
  }
}
