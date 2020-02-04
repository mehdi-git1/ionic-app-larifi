import { HaulTypeEnum } from '../../enums/haul-type.enum';
import { OperatingPerformanceModel } from './operating-performance.model';

export class BusinessIndicatorFlightModel {
    operatingPerformance: OperatingPerformanceModel;

    number: string;
    theoreticalDate: Date;
    legDepartureDate: Date;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    exploitationVersion: string;
    carriedClientVersion: string;
    haulType: HaulTypeEnum;
    cdl: string;
    compoPeq: string;
    d0: number;

}
