import {
    BusinessIndicatorPopulationEnum
} from '../../enums/business-indicators/business-indicator-population.enum copy';

export class BusinessIndicatorSummaryModel {
    population: BusinessIndicatorPopulationEnum;
    escoreAverage: number;
    onTimeShuttleDepartureRatio: number;
    upgradeSum: number;
    flyingBlueAverage: number;
    ercAverage: number;
}
