import { HaulTypeEnum } from '../../enums/haul-type.enum';

export class BusinessIndicatorFlightLightModel {

    number: string;
    theoreticalDate: Date;
    legDepartureDate: Date;
    departureStation: string;
    arrivalStation: string;
    haulType: HaulTypeEnum;
    d0: number;
}
