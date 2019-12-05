import { DateUtils } from './../../../shared/utils/date-utils';
import { EFormsFormTypeEnum } from './../../enums/e-forms/e-forms-form-type.enum';

export class EFormsUrlParamsModel {

    matriculePnProprietaireOuRedacteur: string;

    matriculePnConcerne: string;

    dateDebut: string;

    dateFin: string;

    typesFormulaires: EFormsFormTypeEnum[];

    typesFormulairesAvecPdf: EFormsFormTypeEnum[];

}
