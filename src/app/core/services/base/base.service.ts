import { ConnectivityService } from '../connectivity/connectivity.service';


export abstract class BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        protected onlineProv,
        protected offlineProv) {

    }

    /**
     * Récupère le provider nécessaire Online ou Offline
     */
    protected get provider() {
        if (this.connectivityService.isConnected()) {
            return this.onlineProv;
        } else {
            return this.offlineProv;
        }
    }

    /**
     * Exécute la fonction donnée puis gère les retours si probléme
     * @param functionName Nom de la fonction
     * @param param Paramètres éventuels
     */
    protected execFunctionService(functionName: string, ...param: any[]) {
        return this.provider[functionName](param[0], param[1], param[2], param[3], param[4]).then(
            data => {
                return data;
            },
            error => {
                return this.offlineProv[functionName](param[0], param[1], param[2], param[3], param[4]).then(
                    data => {
                        return data;
                    }
                );
            });
    }
}
