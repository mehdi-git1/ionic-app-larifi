import { HaulTypeEnum } from '../../enums/haul-type.enum';

export class FlightDetailsCardLightModel {

    flightNumber: string;
    flightDate: Date;
    legDepartureDate: Date;
    arrivalStation: string;
    departureStation: string;
    aircraftType: string;
    haulType: HaulTypeEnum;
    escore: number;
    flightActionsTotalNumber: number;
    d0: number;
}
