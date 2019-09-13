import { FormGroup } from '@angular/forms';

export class FormsUtil {

    /**
     * Récupère les valeurs du formulaire et les place dans les prioriétés de l'objet passé en paramètre<br>
     * ATTENTION : le formulaire doit avoir la même structure que l'objet : formGroup et formControl doivent avoir les mêmes
     * noms que les champs de l'objet
     * @param object l'objet à compléter avec les valeurs du formulaire
     * @param form le formulaire dont on souhaite récupérer les valeurs pour compléter l'objet
     * @return l'objet complété avec les valeurs du formulaire
     */
    public static extractFormValues(object: any, form: FormGroup): any {
        if (object && form) {
            for (const formProperty of Object.keys(form.getRawValue())) {
                object[formProperty] = form.getRawValue()[formProperty];
            }
        }

        return object;
    }

    /**
     * Initialise un formulaire avec les valeurs d'un objet donné et réinitialise son état (pristine, dirty, touched etc sont réinitialisés)
     * ATTENTION : le formulaire doit avoir la même structure que l'objet : formGroup et formControl doivent avoir les mêmes
     * noms que les champs de l'objet
     * @param form le formulaire à initialiser
     * @param object l'objet utilisé pour initialiser le formulaire
     */
    public static reset(form: FormGroup, object: any) {
        const initJson = {};
        if (object && form) {
            for (const property in object) {
                if (form.getRawValue().hasOwnProperty(property)) {
                    initJson[property] = object[property];
                }
            }
        }

        form.reset(initJson);
    }
}
