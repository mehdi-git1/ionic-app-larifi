import { PncRoleEnum } from '../../enums/pnc-role.enum';
import {SpecialityEnum} from '../../enums/speciality.enum';

export class SpecialityService{
    /**
     * Permet de retourner le role du PNC en fonction de sa spécialité
     * @param speciality Donner la spécialité du PNC
     * @return Retourne l'enum PNC role qui correspond à la spécialité donné
     */
    getPncRole(speciality: SpecialityEnum) {

        if (SpecialityEnum.CAD === speciality) {
            return PncRoleEnum.MANAGER;
        } else {
            return PncRoleEnum.PNC;
        }
    }
}


