import { tabNavEnum } from './../../shared/enum/tab-nav.enum';
import { TabNavService } from './tab-nav.service';

describe('tabNavService', () => {

    let tabNavService: TabNavService;

    beforeEach(() => {
        tabNavService = new TabNavService();
        tabNavService.listOfTab = [
            { id: tabNavEnum.PNC_HOME_PAGE },
            { id: tabNavEnum.CARRER_OBJECTIVE_LIST_PAGE },
            { id: tabNavEnum.SUMMARY_SHEET_PAGE },
            { id: tabNavEnum.PNC_SEARCH_PAGE },
            { id: tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE },
            { id: tabNavEnum.HELP_ASSET_LIST_PAGE },
            { id: tabNavEnum.STATUTORY_CERTIFICATE_PAGE },
            { id: tabNavEnum.PROFESSIONAL_LEVEL_PAGE }
        ];
    });

    describe('findTabIndex', () => {
        it(`doit ramener 1 lorsque le paramêtre est ${tabNavEnum.CARRER_OBJECTIVE_LIST_PAGE} `, () => {
            const indexReturn = tabNavService.findTabIndex(tabNavEnum.CARRER_OBJECTIVE_LIST_PAGE);
            expect(indexReturn).toBe(1);
        });
    });

});
