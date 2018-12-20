import { UrlConfiguration } from './url.configuration';
import { urlGroupEnum } from './url-group.enum';
import { Config } from '../../../environments/config';

describe('Configuration/url.configuration.ts', () => {

    let urlConfiguration: UrlConfiguration;
    let config: Config;

    beforeEach(() => {
        config = new Config();
        urlConfiguration = new UrlConfiguration(config);
        urlConfiguration.backEndUrlList = {
            'career_objectives_pnc': `${urlGroupEnum.CAREER_OBJECTIVE}/pnc/{matricule}`,
            'career_objectives_pnc_diff': `${urlGroupEnum.CAREER_OBJECTIVE}/{matricule}/pnc`,
            'pnc': 'pnc',
            'test_multi_params': 'url/{id}/suite/{rotationId}'
        };
    });

    describe('getBackEndUrl', () => {
        it('doit retourner une bonne URL si il n\'y a pas de params', () => {
            const expectedReturn = `${config.backEndUrl}/pnc`;
            expect(urlConfiguration.getBackEndUrl('pnc')).toEqual(expectedReturn);
        });

        describe('Tests avec des paramêtres', () => {
            it('doit retourner une bonne URL si il\'y a un params en fin d\'URL', () => {
                const expectedReturn = `${config.backEndUrl}/career_objectives/pnc/M452121`;
                expect(urlConfiguration.getBackEndUrl('career_objectives_pnc', ['M452121'])).toEqual(expectedReturn);
            });

            it('doit retourner une bonne URL si il\'y a un params en milieu d\'URL', () => {
                const expectedReturn = `${config.backEndUrl}/career_objectives/M452121/pnc`;
                expect(urlConfiguration.getBackEndUrl('career_objectives_pnc_diff', ['M452121'])).toEqual(expectedReturn);
            });

            it('doit retourner une bonne URL si il\'y a plusieurs params', () => {
                const expectedReturn = `${config.backEndUrl}/url/M452121/suite/TOGET`;
                expect(urlConfiguration.getBackEndUrl('test_multi_params', ['M452121', 'TOGET'])).toEqual(expectedReturn);
            });

        });
    });
});
