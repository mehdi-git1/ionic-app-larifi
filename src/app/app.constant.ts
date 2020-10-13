import { NotifiedPncSpecialityEnum } from './core/enums/notified-pnc-speciality.enum';

export class AppConstant {
    public static isoDateFormat = 'YYYY-MM-DDTHH:mm:ss';
    public static iso8601DateTimeFormat = 'yyyy-MM-ddTHH:mm:ss\'ZZZZZ';
    public static dateFormat = 'dd/MM/yyyy';
    public static PAGE_SIZE = 10;
    public static datepickerMaxDate = '2050';
    public static ALL = 'ALL';
    public static notifiedPncGradOrdered = [
        NotifiedPncSpecialityEnum.RDD, NotifiedPncSpecialityEnum.RDS, NotifiedPncSpecialityEnum.REFERENT_INSTRUCTOR,
        NotifiedPncSpecialityEnum.CSV
    ];

    // Profiles Habile
    public static P_EDOSPNC_ADMIN = 'P_EDOSPNC_ADMIN';
    public static P_EDOSPNC_PNC = 'P_EDOSPNC_PNC';
    public static P_EDOSPNC_ADMIN_EOBS = 'P_EDOSPNC_ADMIN_EOBS';
    public static P_EDOSPNC_CCO = 'P_EDOSPNC_CCO';
    public static P_EDOSPNC_ISCV = 'P_EDOSPNC_ISCV';
}
