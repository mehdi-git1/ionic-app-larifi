export class GeneralitySkillsModel {
    cca: {
        label: string,
        startDate: Date
    };
    seniorityDate: Date;
    companyLeavingDate: Date;
    pcb: {
        libelle: string,
        validityStartDate: Date,
        validityEndDate: Date
    };
    gene: {
        skillType: string,
        startDate: Date,
        mdcDate: Date,
        dueDate: Date,
        ddvDueDate: Date,
        endDate: Date
    };
    probationaryPeriodDate: Date;
    integrationStageDate: Date;
}
