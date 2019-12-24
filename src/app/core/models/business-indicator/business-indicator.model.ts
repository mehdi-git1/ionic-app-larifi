import { FlightCardModel } from './flight-card.model';

export class BusinessIndicatorModel {
    matricule: string;
    escoreAverage: number;
    onTimeShuttleDepartureRatio: number;
    upgradeAverage: number;
    flyingBlueAndERCAverage: number;
    flightCards: FlightCardModel[];
}
