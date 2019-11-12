import { TabNavEnum } from '../../enums/tab-nav.enum';
import { TabNavService } from './tab-nav.service';

describe('tabNavService', () => {

    let tabNavService: TabNavService;

    beforeEach(() => {
        tabNavService = new TabNavService();
        tabNavService.tabList = [
            { id: TabNavEnum.PNC_HOME_PAGE },
            { id: TabNavEnum.PNC_SEARCH_PAGE },
            { id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE },
            { id: TabNavEnum.HELP_ASSET_LIST_PAGE }
        ];
    });

    describe('findTabIndex', () => {
        it(`doit ramener  lorsque le paramètre est ${TabNavEnum.PNC_SEARCH_PAGE} `, () => {
            const indexReturn = tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE);
            expect(indexReturn).toBe(1);
        });
    });

});