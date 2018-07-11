import { Serializable } from './serializable';
export class AuthenticatedUser extends Serializable {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;

    constructor(obj?: any){
      super(obj);
    }
}
