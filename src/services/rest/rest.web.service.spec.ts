import { TestBed, async } from '@angular/core/testing';
import { RestWebService } from './rest.web.service';
import { Config } from '../../configuration/environment-variables/config';
import { HttpClientModule } from '@angular/common/http';

describe('RestWebService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                HttpClientModule,
                RestWebService,
                Config
            ]
        });
    });

    describe('On vérifie que l\'ensemble des URL utilisées dans l\'appli existent bien côté back', () => {

        let URL = '';
        let config;
        config = new Config();
        if (config.env === 'localhost') {
            config.backEndUrl = 'http://localhost:8080/api/rest/resources';
        }

        for (const backEndUrl in config.backEndUrlList) {
            // On ne test que les URL commençant par get
            if (backEndUrl.match(/^get/)) {
                it(`doit renvoyer une réponse lors de l'appel GET ${backEndUrl} de l'URL ${config.backEndUrlList[backEndUrl]}`, async(() => {
                    URL = config.getBackEndUrl(backEndUrl).replace(/{[a-zA-Z]*}/g, '41122');
                    const restWebService = TestBed.get(RestWebService);

                    restWebService.get(URL).then(data => {
                        expect(data.statusCode).not.toBe(404);
                    }, error => {
                        expect(error.statusCode).toBeDefined();
                        expect(error.statusCode).not.toBe(403);
                        expect(error.statusCode).not.toBe(404);
                    });
                }));
            }
        }
    });
});
