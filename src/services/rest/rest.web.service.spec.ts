import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestWebService } from './rest.web.service';
import { Config } from '../../configuration/environment-variables/config';

describe('Tests des appels rests en mode Web', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                RestWebService,
                Config
            ]
        });
    });


    describe('On vérifie que l\'ensemble des URL définies dans l\'appli sont bien défini dans le back', () => {

        let URL = '';
        let config;
        beforeEach(() => {
            config = new Config();
            URL = config.getBackEndUrl('getCareerObjectives');
        });

        it('doit renvoyer une réponse lors de l\'appel au back', fakeAsync(() => {
            const restWebService = TestBed.get(RestWebService);
            const http = TestBed.get(HttpTestingController);

            const result = http.expectOne(`http://www.google.fr`, 'call to API');
            http.verify();
        }));
    });
});
