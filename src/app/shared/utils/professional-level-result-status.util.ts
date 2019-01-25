import { ProfessionalLevelResultStatus } from '../../core/enums/professional-level-result-status.enum';

export class ProfessionalLevelResultStatusUtil {

    /**
     * Retourne la classe CSS associée au statut d'un stage/module
     * @param professionalLevelResultStatus le statut du stage/module
     * @return la classe CSS associée au statut
     */
    public static getStatusCssClass(professionalLevelResultStatus: ProfessionalLevelResultStatus): string {
        if (ProfessionalLevelResultStatus.SUCCESS == professionalLevelResultStatus) {
            return 'green';
        } else if (ProfessionalLevelResultStatus.SUCCESS_WITH_FC == professionalLevelResultStatus) {
            return 'yellow';
        } else if (ProfessionalLevelResultStatus.SUCCESS_WITH_FC_AND_TESTS == professionalLevelResultStatus) {
            return 'orange';
        } else if (ProfessionalLevelResultStatus.SUCCESS_WITH_RETAKE == professionalLevelResultStatus) {
            return 'orange';
        } else if (ProfessionalLevelResultStatus.FAILED == professionalLevelResultStatus) {
            return 'red';
        }
        return '';
    }
}
