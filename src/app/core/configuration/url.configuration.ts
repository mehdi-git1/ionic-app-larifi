import { Injectable } from '@angular/core';
import { urlGroupEnum } from './url-group.enum';
import { Config } from '../../../environments/config';

@Injectable()
export class UrlConfiguration {

  constructor(private config: Config) {
  }

  public backEndUrlList: {} = {
    'careerObjectives': urlGroupEnum.CAREER_OBJECTIVE,
    'getCareerObjectivesById': `${urlGroupEnum.CAREER_OBJECTIVE}/{id}`,
    'deleteCareerObjectivesById': `${urlGroupEnum.CAREER_OBJECTIVE}/{id}`,
    'getCareerObjectivesByPnc': `${urlGroupEnum.CAREER_OBJECTIVE}/pnc/{matricule}`,
    'setCareerObjectivesInstructorRequestById': `${urlGroupEnum.CAREER_OBJECTIVE}/{id}/instructor_request`,
    'getFormsInputParams': `${urlGroupEnum.FORMS_INPUT_PARAM}/{matricule}/{rotationId}`,
    'eObservations': `${urlGroupEnum.EOBSERVATION}`,
    'getEObservationById': `${urlGroupEnum.EOBSERVATION}/{id}`,
    'getEObservationsByMatricule': `${urlGroupEnum.EOBSERVATION}/pnc/{matricule}`,
    'getAllEObservationsByMatricule': `${urlGroupEnum.EOBSERVATION}/pnc/{matricule}/all`,
    'getLegsById': `${urlGroupEnum.LEG}/{legId}`,
    'getLegsCrewMembersById': `${urlGroupEnum.LEG}/{legId}/crew_members`,
    'pnc': urlGroupEnum.PNC,
    'getPncByMatricule': `${urlGroupEnum.PNC}/{matricule}`,
    'getPncAutoComplete': `${urlGroupEnum.PNC}/auto_complete`,
    'getPncUpcomingRotationsByMatricule': `${urlGroupEnum.PNC}/{matricule}/upcoming_rotations`,
    'getPncLastPerformedRotationsByMatricule': `${urlGroupEnum.PNC}/{matricule}/last_performed_rotations`,
    'getReceivedCongratulationLettersByPnc': `${urlGroupEnum.PNC}/{matricule}/received_congratulation_letters`,
    'getWrittenCongratulationLettersByPnc': `${urlGroupEnum.PNC}/{matricule}/written_congratulation_letters`,
    'getCongratulationLetterById': `${urlGroupEnum.CONGRATULATION_LETTER}/{congratulationLetterId}`,
    'pncPhotos': urlGroupEnum.PNC_PHOTO,
    'getPncPhotoByMatricule': `${urlGroupEnum.PNC_PHOTO}/{matricule}`,
    'getSecurityInfos': urlGroupEnum.ME,
    'secretInfos': urlGroupEnum.PIN,
    'getSecretInfosByMatricule': `${urlGroupEnum.PIN}/{matricule}`,
    'getStatutoryCertificateByMatricule': `${urlGroupEnum.STATUTORY_CERTIFICATE}/{matricule}`,
    'getProfessionalInterviewsByMatricule': `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/{matricule}`,
    'professionalInterviews': urlGroupEnum.PROFESSIONAL_INTERVIEW,
    'deleteProfessionalInterviewById': `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/{id}`,
    'pncSynchro': urlGroupEnum.PNC_SYNCHRO,
    'getPncSynchroByPnc': `${urlGroupEnum.PNC_SYNCHRO}/{matricule}`,
    'getWaypointsByCarreObjectiveId': `${urlGroupEnum.WAYPOINT}/career_objective/{careerObjectiveId}`,
    'getWaypointById': `${urlGroupEnum.WAYPOINT}/{waypointId}`,
    'crudWaypointByCarreObjectiveId': `${urlGroupEnum.WAYPOINT}/career_objective/{careerObjectiveId}`,
    'deleteWaypointsById': `${urlGroupEnum.WAYPOINT}/{waypointId}`,
    'getProfessionalLevelByMatricule': `${urlGroupEnum.PROFESSIONAL_LEVEL}/{matricule}`,
    'getRotationsByTechId': `${urlGroupEnum.ROTATION}/{techId}/legs`,
    'getImpersonationAvailableByMatricule': `${urlGroupEnum.IMPERSONATION_AVAILABLE}/{matricule}`,
    'getHelpAssetsByRoleId': `${urlGroupEnum.HELP_ASSET}/pnc_role/{roleId}`,
    'userMessages': urlGroupEnum.USER_MESSAGE,
    'userProfiles': urlGroupEnum.USER_PROFILE,
    'userPermissions': urlGroupEnum.USER_PERMISSION,
    'userPermissionsByUserProfile': `${urlGroupEnum.USER_PROFILE}/{name}/${urlGroupEnum.USER_PERMISSION}`,
    'getPing': urlGroupEnum.PING,
    'updatePermissions': `${urlGroupEnum.USER_PROFILE}/{profileName}/update_permissions`,
    'getAllAppVersions': urlGroupEnum.APP_VERSION,
    'createAppVersion': `${urlGroupEnum.APP_VERSION}/create`
  };

  /**
   * renvoie l'URL devant être utilisée pour les appels aux backEnd
   * @param  key Clef désignant l'URI à utiliser (PNC, career-objective, etc...)
   * @param  params paramètres à intégrer dans l'URL (tableau de param)
   * @return url du backEnd vers laquelle pointer
   */
  public getBackEndUrl(key, params = []): string {
    let urlToModify = this.backEndUrlList[key];
    // Les paramètres étant entre crochets, il faut les identifier avant de les remplacer
    // Les noms ne sont jamais les mêmes
    const regexToReplace = /{[a-zA-Z]*}/;
    // Remplacement des paramètres de l'URL
    for (let i = 0; i < params.length; i++) {
      urlToModify = urlToModify.replace(regexToReplace, params[i]);
    }
    return `${this.config.backEndUrl}/${urlToModify}`;
  }

}
