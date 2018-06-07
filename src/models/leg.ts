import { Rotation } from './rotation';

export class Leg {
    techId: number;
    company: string;
    number: string;
    departureDate: string;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    rotation: Rotation;
}
