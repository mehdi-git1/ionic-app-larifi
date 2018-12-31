import { ModuleCardComponent } from './module-card.component';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { ModuleTypeEnum } from '../../../../core/enums/module-type.enum';
import { CursusModel } from '../../../../core/models/professional-level/cursus.model';

describe('ModuleCardComponent', () => {

    let moduleCardComponent: ModuleCardComponent;

    beforeEach(() => {
        moduleCardComponent = new ModuleCardComponent(null);
    });

    describe('checkPointColorInFunctionOfModuleStatus', () => {
        it('Si le statut du module est SUCCESS, le point doit être vert', () => {
            checkPointColorInFunctionOfModuleStatus('SUCCESS', 'green-point');
        });

        it('Si le statut du module est SUCCESS_WITH_FC, le point doit être orange', () => {
            checkPointColorInFunctionOfModuleStatus('SUCCESS_WITH_FC', 'orange-point');
        });

        it('Si le statut du module est FAILED, le point doit être rouge', () => {
            checkPointColorInFunctionOfModuleStatus('FAILED', 'red-point');
        });

        function checkPointColorInFunctionOfModuleStatus(moduleStatus: string, colorPointClass: string) {
            moduleCardComponent.module = new ModuleModel();
            moduleCardComponent.module.moduleResultStatus = moduleStatus;
            expect(moduleCardComponent.getModuleStatusPointCssClass()).toEqual(colorPointClass);
        }
    });

    describe('isModuleDetailAvailable', () => {

        it('doit retourner vrai si le module est théorique et contient des cursus', () => {
            const module = new ModuleModel();
            module.moduleType = ModuleTypeEnum.THEORETICAL;
            module.cursus = [new CursusModel()];
            expect(moduleCardComponent.isModuleDetailAvailable(module)).toBeTruthy();
        });


        it('doit retourner faux si le module est théorique et ne contient pas de cursus', () => {
            const module = new ModuleModel();
            module.cursus = [];
            module.moduleType = ModuleTypeEnum.THEORETICAL;
            expect(moduleCardComponent.isModuleDetailAvailable(module)).toBeFalsy();
        });

        it('doit retourner vrai si le module est pratique', () => {
            const module = new ModuleModel();
            module.moduleType = ModuleTypeEnum.PRACTICAL;
            expect(moduleCardComponent.isModuleDetailAvailable(module)).toBeTruthy();
        });
    });
});
