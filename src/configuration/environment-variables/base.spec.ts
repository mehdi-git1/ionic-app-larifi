import { BaseConfig, urlGroupName } from './base';

describe('Configuration/base.ts', () => {

    let baseConfig: BaseConfig;

    beforeEach(() => {
        class MyClass extends BaseConfig { }
        baseConfig = new MyClass();
        baseConfig.backEndUrl = '/api/rest/resources';
        baseConfig.backEndUrlList = {
            'career_objectives_pnc': `${urlGroupName.CAREER_OBJECTIVE}/pnc/{matricule}`,
            'career_objectives_pnc_diff': `${urlGroupName.CAREER_OBJECTIVE}/{matricule}/pnc`,
            'pnc': 'pnc',
            'test_multi_params': 'url/{id}/suite/{rotationId}'
        };
    });

    describe('getBackEndUrl', () => {
        it('doit retourner une bonne URL si il n\'y a pas de params', () => {
            const expectedReturn = `${baseConfig.backEndUrl}/pnc`;
            expect(baseConfig.getBackEndUrl('pnc')).toEqual(expectedReturn);
        });

        describe('Tests avec des paramêtres', () => {
            it('doit retourner une bonne URL si il\'y a un params en fin d\'URL', () => {
                const expectedReturn = `${baseConfig.backEndUrl}/career_objectives/pnc/M452121`;
                expect(baseConfig.getBackEndUrl('career_objectives_pnc', ['M452121'])).toEqual(expectedReturn);
            });

            it('doit retourner une bonne URL si il\'y a un params en milieu d\'URL', () => {
                const expectedReturn = `${baseConfig.backEndUrl}/career_objectives/M452121/pnc`;
                expect(baseConfig.getBackEndUrl('career_objectives_pnc_diff', ['M452121'])).toEqual(expectedReturn);
            });

            it('doit retourner une bonne URL si il\'y a plusieurs params', () => {
                const expectedReturn = `${baseConfig.backEndUrl}/url/M452121/suite/TOGET`;
                expect(baseConfig.getBackEndUrl('test_multi_params', ['M452121', 'TOGET'])).toEqual(expectedReturn);
            });

        });
    });
});
