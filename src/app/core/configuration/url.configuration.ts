import { Injectable } from '@angular/core';

import { Config } from '../../../environments/config';
import { urlGroupEnum } from './url-group.enum';

@Injectable({ providedIn: 'root' })
export class UrlConfiguration {

  constructor(private config: Config) {
  }

  public backEndUrlList: {} = {
    careerObjectives: urlGroupEnum.CAREER_OBJECTIVE,
    getCareerObjectivesById: `${urlGroupEnum.CAREER_OBJECTIVE}/{id}`,
    deleteCareerObjectivesById: `${urlGroupEnum.CAREER_OBJECTIVE}/{id}`,
    getCareerObjectivesByPnc: `${urlGroupEnum.CAREER_OBJECTIVE}/pnc/{matricule}`,
    getCareerObjectivesByRedactor: `${urlGroupEnum.CAREER_OBJECTIVE}/redactor/{matricule}`,
    setCareerObjectivesInstructorRequestById: `${urlGroupEnum.CAREER_OBJECTIVE}/{id}/instructor_request`,
    eObservations: `v2/${urlGroupEnum.EOBSERVATION}`,
    getEObservationById: `v2/${urlGroupEnum.EOBSERVATION}/{id}`,
    getEObservationsByMatricule: `v2/${urlGroupEnum.EOBSERVATION}/pnc/{matricule}`,
    getEObservationsByRedactorMatricule: `v2/${urlGroupEnum.EOBSERVATION}/redactor/{matricule}`,
    getAllEObservationsByMatricule: `v2/${urlGroupEnum.EOBSERVATION}/pnc/{matricule}/all`,
    getAllPcbReferentialItemLevelsByVersion: `v2/${urlGroupEnum.EOBSERVATION}/AllEpcbRefItem/{version}`,
    getLegsById: `${urlGroupEnum.LEG} /{legId}`,
    getCrewMembersFromLeg: `${urlGroupEnum.LEG}/crew_members/{company}/{flightNumber}/{date}/{departureStation}`,
    pnc: `v2/${urlGroupEnum.PNC}?page={page}&size={size}`,
    getPncByMatricule: `${urlGroupEnum.PNC}/{matricule}`,
    getPncAutoComplete: `v2/${urlGroupEnum.PNC}/auto_complete`,
    getAllRecipients: `v2/${urlGroupEnum.PNC}/recipients`,
    sendMailingCampaign: `v2/${urlGroupEnum.PNC}/sendmailingcampaign`,
    getPncUpcomingRotationsByMatricule: `${urlGroupEnum.PNC}/{matricule}/upcoming_rotations`,
    getPncLastPerformedRotationsByMatricule: `${urlGroupEnum.PNC}/{matricule}/last_performed_rotations`,
    getReceivedCongratulationLettersByPnc: `${urlGroupEnum.PNC}/{matricule}/received_congratulation_letters`,
    getWrittenCongratulationLettersByPnc: `${urlGroupEnum.PNC}/{matricule}/written_congratulation_letters`,
    getAllRotationsByMatricule: `${urlGroupEnum.PNC}/{matricule}/rotations`,
    congratulationLetters: urlGroupEnum.CONGRATULATION_LETTER,
    getCongratulationLetterById: `${urlGroupEnum.CONGRATULATION_LETTER}/{congratulationLetterId}`,
    deleteReceivedCongratulationLetterByIdAndMatricule: `${urlGroupEnum.CONGRATULATION_LETTER}/{id}/{matricule}`,
    deleteWrittenCongratulationLetterById: `${urlGroupEnum.CONGRATULATION_LETTER}/redactor/{id}`,
    pncPhotos: urlGroupEnum.PNC_PHOTO,
    getPncPhotoByMatricule: `${urlGroupEnum.PNC_PHOTO}/{matricule}`,
    getSecurityInfos: urlGroupEnum.ME,
    secretInfos: urlGroupEnum.PIN,
    getStatutoryCertificateByMatricule: `${urlGroupEnum.STATUTORY_CERTIFICATE}/{matricule}`,
    getProfessionalInterviewsByMatricule: `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/pnc/{matricule}`,
    getProfessionalInterviewsByRedactorMatricule: `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/redactor/{matricule}`,
    professionalInterviews: urlGroupEnum.PROFESSIONAL_INTERVIEW,
    deleteProfessionalInterviewById: `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/{id}`,
    getProfessionalInterviewById: `${urlGroupEnum.PROFESSIONAL_INTERVIEW}/{id}`,
    pncSynchro: `v3/${urlGroupEnum.PNC_SYNCHRO}`,
    getPncSynchroByPnc: `v3/${urlGroupEnum.PNC_SYNCHRO}/{matricule}`,
    getWaypointsByCarreObjectiveId: `${urlGroupEnum.WAYPOINT}/career_objective/{careerObjectiveId}`,
    getWaypointById: `${urlGroupEnum.WAYPOINT}/{waypointId}`,
    crudWaypointByCarreObjectiveId: `${urlGroupEnum.WAYPOINT}/career_objective/{careerObjectiveId}`,
    deleteWaypointsById: `${urlGroupEnum.WAYPOINT}/{waypointId}`,
    getProfessionalLevelByMatricule: `${urlGroupEnum.PROFESSIONAL_LEVEL}/{matricule}`,
    getRotationsByTechId: `${urlGroupEnum.ROTATION}/{techId}/legs`,
    getImpersonationAvailableByMatricule: `${urlGroupEnum.IMPERSONATION_AVAILABLE}/{matricule}`,
    getHelpAssetsByRoleId: `${urlGroupEnum.HELP_ASSET}/pnc_role/{roleId}`,
    userMessages: urlGroupEnum.USER_MESSAGE,
    userProfiles: urlGroupEnum.USER_PROFILE,
    userPermissions: urlGroupEnum.USER_PERMISSION,
    userPermissionsByUserProfile: `${urlGroupEnum.USER_PROFILE}/{name}/${urlGroupEnum.USER_PERMISSION}`,
    getPing: urlGroupEnum.PING,
    updatePermissions: `${urlGroupEnum.USER_PROFILE}/{profileName}/update_permissions`,
    appVersions: urlGroupEnum.APP_VERSION,
    getAllAppVersions: urlGroupEnum.APP_VERSION,
    getAppVersionById: `${urlGroupEnum.APP_VERSION}/{id}`,
    deleteAppVersionById: `${urlGroupEnum.APP_VERSION}/{id}`,
    logbookEvents: urlGroupEnum.LOGBOOK_EVENT,
    hideOrDisplayLogbookEvent: `${urlGroupEnum.LOGBOOK_EVENT}/hideOrDisplay/{id}`,
    getLogbookEventsByGroupId: `${urlGroupEnum.LOGBOOK_EVENT}/event_group/{groupId}`,
    getLogbookEventsByFilters: `${urlGroupEnum.LOGBOOK_EVENT}/pnc/{matricule}`,
    getLogbookEvents: `${urlGroupEnum.LOGBOOK_EVENT}/pnc/{matricule}`,
    deleteLogbookEventById: `${urlGroupEnum.LOGBOOK_EVENT}/{id}`,
    fixCongratulationLetterRecipient: `${urlGroupEnum.CONGRATULATION_LETTER}/recipients/{id}`,
    getDocumentById: `${urlGroupEnum.DOCUMENT}/{documentId}`,
    hrDocuments: urlGroupEnum.HR_DOCUMENT,
    getHrDocumentById: `${urlGroupEnum.HR_DOCUMENT}/{id}`,
    getDwhHistory: `${urlGroupEnum.DWH_HISTORY}/{matricule}`,
    findPncBusinessIndicators: `${urlGroupEnum.BUSINESS_INDICATORS}/{matricule}/list`,
    getBusinessIndicatorSummaries: `v2/${urlGroupEnum.BUSINESS_INDICATORS}/{matricule}/summaries`,
    getBusinessIndicatorSummariesByFilter: `v2/${urlGroupEnum.BUSINESS_INDICATORS}/{matricule}/comparison`,
    getBusinessIndicatorSummariesByPopulation: `v2/${urlGroupEnum.BUSINESS_INDICATORS}/population`,
    getBusinessIndicator: `${urlGroupEnum.BUSINESS_INDICATORS}/{id}`,
    reportEScoreCommentVerbatim: `${urlGroupEnum.ESCORE_COMMENTS}/{id}/report/{commentVerbatim}`,
    reportShortLoopCommentVerbatim: `${urlGroupEnum.SHORT_LOOP_COMMENTS}/{id}/report/{commentVerbatim}`,
    getLastAppVersion: `${urlGroupEnum.APP_VERSION}/last`,
    downloadManifexPdfById: `${urlGroupEnum.PDFS}/manifex/{id}`,
    downloadEObservationPdfById: `${urlGroupEnum.PDFS}/eobservation/{id}`,
    getMyBoardNotification: `${urlGroupEnum.MY_BOARD}`,
    getMyBoardNotificationSummary: `${urlGroupEnum.MY_BOARD}/summary`,
    readMyBoardNotifications: `${urlGroupEnum.MY_BOARD}/checked/{isRead}`,
    archiveNotifications: `${urlGroupEnum.MY_BOARD}/archived/{isArchived}`,
    deleteNotifications: `${urlGroupEnum.MY_BOARD}/delete`
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
    for (const element of params) {
      urlToModify = urlToModify.replace(regexToReplace, element);
    }
    return `${this.config.backEndUrl}/${urlToModify}`;
  }

}
