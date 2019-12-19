import { FlightCardModel } from './flight-card.model';
export class BusinessIndicatorModel {
    matricule: string;
    averageEscore: number;
    averageActionsAboard: number;
    flightCards: FlightCardModel[];
}
