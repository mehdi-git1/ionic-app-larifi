import { ModuleCardComponent } from './module-card.component';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';

describe('ModuleCardComponent', () => {

    it('Si le statut du module est SUCCESS, le point doit être vert', () => {
        checkPointColorInFunctionOfModuleStatus('SUCCESS', 'green-point')
    });

    it('Si le statut du module est SUCCESS_WITH_FC, le point doit être orange', () => {
        checkPointColorInFunctionOfModuleStatus('SUCCESS_WITH_FC', 'orange-point')
    });

    it('Si le statut du module est FAILED, le point doit être rouge', () => {
        checkPointColorInFunctionOfModuleStatus('FAILED', 'red-point')
    });

    function checkPointColorInFunctionOfModuleStatus(moduleStatus: string, colorPointClass: string) {
        const moduleCardComponent = new ModuleCardComponent(null);
        moduleCardComponent.module = new ModuleModel();
        moduleCardComponent.module.moduleResultStatus = moduleStatus;
        expect(moduleCardComponent.getModuleStatusPointCssClass()).toEqual(colorPointClass);
    }
});
