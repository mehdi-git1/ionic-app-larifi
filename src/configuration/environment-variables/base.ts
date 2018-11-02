export enum urlGroupName {
  'CAREER_OBJECTIVE' = 'career_objectives',
  'EOBSERVATION' = 'eobservation',
  'LEG' = 'legs',
  'PNC' = 'pnc',
  'PNC_PHOTOS' = 'pnc_photos',
  'ME' = 'me',
  'PARAMETERS' = 'parameters',
  'PIN' = 'pin',
  'STATUTORY_CERTIFICATE' = 'stautory_certificate',
  'PNC_SUMMARY_SHEET' = 'pnc_summary_sheets',
  'PNC_SYNCHRO' = 'pnc_synchro',
  'WAYPOINT' = 'waypoints'
}

export abstract class BaseConfig {
  public appVersion = '';
  public backEndUrl = '/api/rest/resources';
  public pingUrl = '/api/rest/resources/ping';
  public secmobileEnv = 'rct';
  public appName = 'EDossierPnc';
  public env = 'localhost';

  public backEndUrlList: {} = {
    'getCareerObjectives': urlGroupName.CAREER_OBJECTIVE,
    'getCareerObjectivesById': `${urlGroupName.CAREER_OBJECTIVE}/{id}`,
    'getCareerObjectivesByPnc': `${urlGroupName.CAREER_OBJECTIVE}/pnc/{matricule}`,
    'setCareerObjectivesInstructorRequestById': `${urlGroupName.CAREER_OBJECTIVE}/{id}/instructor_request`,
    'getEobservation': `${urlGroupName.EOBSERVATION}/{matricule}/{rotationId}`,
    'getLegsById': `${urlGroupName.LEG}/{legId}`,
    'getLegsCrewMembersById': `${urlGroupName.LEG}/{legId}/crew_members`,
    'pnc': urlGroupName.PNC,
    'getPncByMatricule': `${urlGroupName.PNC}/{matricule}`,
    'getPncUpcomingRotationsByMatricule': `${urlGroupName.PNC}/{matricule}/upcoming_rotations`,
    'getPncLastPerformedRotationsByMatricule': `${urlGroupName.PNC}/{matricule}/last_performed_rotations`,
    'pncPhotos': urlGroupName.PNC_PHOTOS,
    'getPncPhotosByMatricule': `${urlGroupName.PNC_PHOTOS}/{matricule}`,
    'getSecurityInfos': urlGroupName.ME,
    'secretInfos': urlGroupName.PIN,
    'getSecretInfosByMatricule': `${urlGroupName.PIN}/{matricule}`,
    'getStatutoryCertificateByMatricule': `${urlGroupName.STATUTORY_CERTIFICATE}/{matricule}`,
    'getSummarySheetByMatricule': `${urlGroupName.PNC_SUMMARY_SHEET}/{matricule}`,
    'pncSynchro': urlGroupName.PNC_SYNCHRO,
    'getPncSynchroByPnc': `${urlGroupName.PNC_SYNCHRO}/{matricule}`,
    'crudWaypointsByCarreObjectiveId': `${urlGroupName.WAYPOINT}/career_objective/{careerObjectiveId}`,
    'getParameters': urlGroupName.PARAMETERS
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
   * renvoi l'URL devant être utilisée pour les appels aux backEnd
   * @param  key Clef désignant l'URI à utiliser (PNC, career-objective, etc...)
   * @param  params paramétres à intégrer dans l'URL (tableau de param)
   * @return url du backEnd vers laquelle pointer
   */
  public getBackEndUrl(key, params = []): string {
    let urlToModify = this.backEndUrlList[key];
    // Les paramétres étant entre crochet, il faut les identifier avant de les remplacer
    // Les noms ne sont jamais les mêmes
    const regexToReplace = /{[a-zA-Z]*}/;
    // Remplacement des paramêtres de l'URL
    for (let i = 0; i < params.length; i++) {
      urlToModify = urlToModify.replace(regexToReplace, params[i]);
    }
    return `${this.backEndUrl}/${urlToModify}`;
  }

}
