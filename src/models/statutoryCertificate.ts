export class StatutoryCertificate {
    aircraftSkills: Array<string>;
    generalitySkills: GeneralitySkills;
    planeSkills: Array<PlaneSkill>;
    familiarizationFlights: Array<FamiliarizationFlight>;
    masteringQualification: MasteringQualification;
    annualElearning: AnnualElearning;
    vam: VAM;
}

class GeneralitySkills{
    cca: [{
        libelle: string,
        startDate: Date,
        dueDate: Date
    }];
    pcb: [{
        libelle: string,
        startDate: Date,
        validityStartDate: Date,
        dueDate: Date
    }];
    gene: [{
        aircraftSkill: string,
        startDate: Date,
        mdcDate: Date,
        dueDate: Date,
        ddvDueDate: Date,
        skillEndDate: Date
    }];
}

class PlaneSkill{
    plane: string;
    startDate: Date;
    mdcDate: Date;
    dueDate: Date;
    ddvDueDate: Date;
    skillEndDate: Date;
}

class FamiliarizationFlight{
    haulType: HaulType;
    fa1Date: Date;
    fa2Date: Date;
}

enum HaulType{
    LC= 'STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.LC',
    MC= 'STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.MC'
}

class MasteringQualification{}
class AnnualElearning{}

class VAM{
    validityStartDate: Date;
    validityEndDate: Date;
}
