import { CareerObjectiveStatusEnum } from './../../../../core/enums/career-objective-status.enum';
import { CareerObjectiveComponent } from './career-objective.component';


describe('career-objective.component', () => {

    let careerObjectiveComponent: CareerObjectiveComponent;

    beforeEach(() => {
        careerObjectiveComponent = new CareerObjectiveComponent();
    });

    describe('getStatusCssClass', () => {
        it(`doit renvoyer validated-dot si le résultat est ${CareerObjectiveStatusEnum.VALIDATED}`, () => {
            expect(careerObjectiveComponent.getStatusCssClass(CareerObjectiveStatusEnum.VALIDATED)).toEqual('validated-dot');
        });

        it(`doit renvoyer draft-dot si le résultat est ${CareerObjectiveStatusEnum.DRAFT}`, () => {
            expect(careerObjectiveComponent.getStatusCssClass(CareerObjectiveStatusEnum.DRAFT)).toEqual('draft-dot');
        });

        it(`doit renvoyer registered-dot si le résultat est ${CareerObjectiveStatusEnum.REGISTERED}`, () => {
            expect(careerObjectiveComponent.getStatusCssClass(CareerObjectiveStatusEnum.REGISTERED)).toEqual('registered-dot');
        });

        it(`doit renvoyer abandoned-dot si le résultat est ${CareerObjectiveStatusEnum.ABANDONED}`, () => {
            expect(careerObjectiveComponent.getStatusCssClass(CareerObjectiveStatusEnum.ABANDONED)).toEqual('abandoned-dot');
        });
    });

});
