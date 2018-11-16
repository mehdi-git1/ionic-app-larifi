import { ModuleCardComponent } from './module-card';
import { Module } from '../../../core/models/professionalLevel/module';

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
        const moduleCardComponent = new ModuleCardComponent();
        moduleCardComponent.module = new Module();
        moduleCardComponent.module.moduleResultStatus = moduleStatus;
        expect(moduleCardComponent.getModuleStatusPointCssClass()).toEqual(colorPointClass);
    }
});
