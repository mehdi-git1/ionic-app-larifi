import { ConnectivityService } from '../../services/connectivity/connectivity.service';


export abstract class BaseProvider {

    constructor(
        protected connectivityService: ConnectivityService,
        protected onlineProv,
        protected offlineProv) {

    }

    /**
     * Récupére le provider nécessaire Online ou Offline
     */
    protected get provider() {
        if (this.connectivityService.isConnected()) {
            return this.onlineProv;
        } else {
            return this.offlineProv;
        }
    }

    /**
     * Execute la fonction donnée puis gére les retours si probléme
     * @param functionName Nom de la fonction
     * @param param Paramétres éventuels
     */
    protected execFunctionProvider(functionName: string, ...param: any[]) {
        return this.provider[functionName](param[0], param[1]).then(
            data => {
                return data;
            },
            error => {
                return this.offlineProv[functionName](param[0], param[1]).then(
                    data => {
                        return data;
                    }
                );
            });
    }
}
