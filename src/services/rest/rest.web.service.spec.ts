import { TestBed, fakeAsync, flush, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestWebService } from './rest.web.service';
import { Config } from '../../configuration/environment-variables/config';
import { HttpClientModule } from '@angular/common/http';

describe('Tests des appels rests en mode Web', () => {

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

    describe('On vérifie que l\'ensemble des URL définies dans l\'appli sont bien défini dans le back', () => {

        let URL = '';
        let config;
        beforeEach(() => {
            config = new Config();
            config.backEndUrl = 'http://localhost:8080/api/rest/resources';
            URL = config.getBackEndUrl('getCareerObjectivesById', [1]);
        });

        it('doit renvoyer une réponse lors de l\'appel au back', async(() => {
            const restWebService = TestBed.get(RestWebService);
            // const http = TestBed.get(HttpTestingController);

            restWebService.get(URL).then(data => {
                console.log('data ---------------- ', data);
                expect(data.length).toBe(0);
            }, error => {
                console.log('data ---------------- ', error);
                expect(error.statusCode).toBe(1);
            });

            /* const result = http.expectOne(URL, 'call to API');
             console.log(result);
             http.verify();*/
        }));
    });
});
