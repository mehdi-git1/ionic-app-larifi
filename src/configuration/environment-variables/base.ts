export enum urlGroupName {
  'CAREER_OBJECTIVE' = 'career_objectives',
  'EOBSERVATION' = 'eobservation',
  'LEG' = 'legs',
  'PNC' = 'pncs',
  'PNC_PHOTO' = 'pnc_photos',
  'ME' = 'me',
  'PARAMETERS' = 'parameters',
  'HELP_ASSET' = 'help_assets',
  'PIN' = 'pin',
  'STATUTORY_CERTIFICATE' = 'statutory_certificate',
  'PNC_SUMMARY_SHEET' = 'pnc_summary_sheets',
  'PNC_SYNCHRO' = 'pnc_synchros',
  'WAYPOINT' = 'waypoints',
  'PROFESSIONAL_LEVEL' = 'professional_levels',
  'ROTATION' = 'rotations',
  'IMPERSONATION_AVAILABLE' = 'check_impersonation_available'
}

export abstract class BaseConfig {
  public appVersion = '';
  public backEndUrl = '/api/rest/resources';
  public pingUrl = '/api/rest/resources/ping';
  public secmobileEnv = 'rct';
  public appName = 'EDossierPnc';
  public env = 'localhost';

  public backEndUrlList: {} = {
    'careerObjectives': urlGroupName.CAREER_OBJECTIVE,
    'getCareerObjectivesById': `${urlGroupName.CAREER_OBJECTIVE}/{id}`,
    'deleteCareerObjectivesById': `${urlGroupName.CAREER_OBJECTIVE}/{id}`,
    'getCareerObjectivesByPnc': `${urlGroupName.CAREER_OBJECTIVE}/pnc/{matricule}`,
    'setCareerObjectivesInstructorRequestById': `${urlGroupName.CAREER_OBJECTIVE}/{id}/instructor_request`,
    'getEobservation': `${urlGroupName.EOBSERVATION}/{matricule}/{rotationId}`,
    'getLegsById': `${urlGroupName.LEG}/{legId}`,
    'getLegsCrewMembersById': `${urlGroupName.LEG}/{legId}/crew_members`,
    'pnc': urlGroupName.PNC,
    'getPncByMatricule': `${urlGroupName.PNC}/{matricule}`,
    'getPncUpcomingRotationsByMatricule': `${urlGroupName.PNC}/{matricule}/upcoming_rotations`,
    'getPncLastPerformedRotationsByMatricule': `${urlGroupName.PNC}/{matricule}/last_performed_rotations`,
    'pncPhotos': urlGroupName.PNC_PHOTO,
    'getPncPhotosByMatricule': `${urlGroupName.PNC_PHOTO}/{matricule}`,
    'getSecurityInfos': urlGroupName.ME,
    'secretInfos': urlGroupName.PIN,
    'getSecretInfosByMatricule': `${urlGroupName.PIN}/{matricule}`,
    'getStatutoryCertificateByMatricule': `${urlGroupName.STATUTORY_CERTIFICATE}/{matricule}`,
    'getSummarySheetByMatricule': `${urlGroupName.PNC_SUMMARY_SHEET}/{matricule}`,
    'pncSynchro': urlGroupName.PNC_SYNCHRO,
    'getPncSynchroByPnc': `${urlGroupName.PNC_SYNCHRO}/{matricule}`,
    'getWaypointsByCarreObjectiveId': `${urlGroupName.WAYPOINT}/career_objective/{careerObjectiveId}`,
    'getWaypointById': `${urlGroupName.WAYPOINT}/{waypointId}`,
    'crudWaypointByCarreObjectiveId': `${urlGroupName.WAYPOINT}/career_objective/{careerObjectiveId}`,
    'deleteWaypointsById': `${urlGroupName.WAYPOINT}/career_objective/{waypointId}`,
    'getParameters': urlGroupName.PARAMETERS,
    'getProfessionalLevelByMatricule': `${urlGroupName.PROFESSIONAL_LEVEL}/{matricule}`,
    'getRotationsByTechId': `${urlGroupName.ROTATION}/{techId}/legs`,
    'getImpersonationAvailableByMatricule': `${urlGroupName.IMPERSONATION_AVAILABLE}/{matricule}`,
    'getHelpAssetsByRoleId': `${urlGroupName.HELP_ASSET}/pnc_role/{roleId}`
  };

  public eObsUrl = 'com.airfrance.mobile.inhouse.eformstrainingdevPNC';
  public eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV';
  public eObsCallbackActionLabel = 'Retour eDossierPNC';

  public makeOfflineModeAvailable = false;

  /**
   * Vérifie qu'on est en local
   * @return  vrai si on est sur l'env localhost, false sinon
   */
  public isLocalhost(): boolean {
    return this.env === 'localhost';
  }

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
    return `${this.backEndUrl}/${urlToModify}`;
  }

}
