import { TabNavEnum } from '../../enums/tab-nav.enum';
import { TabNavService } from './tab-nav.service';

describe('tabNavService', () => {

    let tabNavService: TabNavService;

    beforeEach(() => {
        tabNavService = new TabNavService();
        tabNavService.listOfTab = [
            { id: TabNavEnum.PNC_HOME_PAGE },
            { id: TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE },
            { id: TabNavEnum.PNC_SEARCH_PAGE },
            { id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE },
            { id: TabNavEnum.HELP_ASSET_LIST_PAGE },
            { id: TabNavEnum.STATUTORY_CERTIFICATE_PAGE },
            { id: TabNavEnum.PROFESSIONAL_LEVEL_PAGE }
        ];
    });

    describe('findTabIndex', () => {
        it(`doit ramener 1 lorsque le paramêtre est ${TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE} `, () => {
            const indexReturn = tabNavService.findTabIndex(TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE);
            expect(indexReturn).toBe(1);
        });
    });

});
