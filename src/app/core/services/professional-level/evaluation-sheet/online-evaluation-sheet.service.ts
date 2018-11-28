import { EvaluationSheetModel } from './../../../models/professional-level/evaluation-sheet.model';
import { ProfessionalLevelModel } from './../../../models/professional-level/professional-level.model';
import { Injectable } from '@angular/core';
import { RestService } from '../../../http/rest/rest.base.service';
import { Config } from '../../../../../environments/config';

@Injectable()
export class OnlineEvaluationSheetService {

    constructor(public restService: RestService,
        public config: Config) {
    }

    /**
     * Récupère le niveau pro SV d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le niveau pro SV
     * @return le niveau pro SV du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
        // return this.restService.get(`${this.config.backEndUrl}/statutory_reporting/${matricule}`);
        return new Promise((resolve, reject) => {
            const EvaluationSheet = new ProfessionalLevelModel();
            // EvaluationSheet.stagesList = [{ date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
            // { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
            // { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' }];
            resolve(EvaluationSheet);
        });
    }

    getEvaluationSheet(module: string): Promise<EvaluationSheetModel> {
        // return new Promise((resolve, reject) => {
        //     const moduleData = {
        //         techID: '7785',
        //         stageCode: 'SM9',
        //         name: 'Portes A340',
        //         endDate: new Date(),
        //         resultCode: 'failure',
        //         resultText: 'ECHEC',
        //         score: {
        //             E1: '70%',
        //             E2: '85%',
        //             evaluationComment: 'Lorem ipsum sit amet, consectetuae adipiscong elit, sad diam nonummy mibh ausimdo',
        //             FC: '90%',
        //             FCComment: 'Lorem ipsum sit amet, consectetuae adipiscong elit, sad diam nonummy mibh ausimdo'
        //         },
        //         subModules: [{
        //             title: 'Désarmement toboggan',
        //             evaluations: [{
        //                 text: 'Placer le sélecteur sur disarmed',
        //                 types: { E1: '70%' }
        //             },
        //             {
        //                 text: 'Insérer la goupille de sécurité',
        //                 types: { E1: '70%', E2: '80%' }
        //             }]
        //         },
        //         {
        //             title: 'Ouverture en mode normal',
        //             evaluations: [{
        //                 text: 'Vérifier porte desarmée',
        //                 types: { E1: '70%' }
        //             },
        //             {
        //                 text: 'Vérifier la présence d\'un MAC',
        //                 types: { E1: '70%', FC: '80%' }
        //             }]
        //         }
        //         ]
        //     };
        //     resolve(moduleData);
        // });
        return this.restService.get(`${this.config.backEndUrl}/professional_levels/${module}`);
    }
}
