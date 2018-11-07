import { Utils } from './utils';

describe('utils', () => {

    describe('vérification de la fonction fromStringToObject', () => {
        it('doit retourner un objet JSON si le paramètre est une chaîne de caractères de type JSON', () => {
            expect(Utils.fromStringToObject('{"test": "test"}')).toEqual({ test: 'test' });
        });

        it('doit retourner un objet JSON (en replaçant \\\\ par "") si le paramètre est une chaine de caractères de type JSON ', () => {
            expect(Utils.fromStringToObject('{"test": "t\\est"}')).toEqual({ test: 'test' });
        });

        it('doit retourner null si le paramètre n\'est pas une chaîne de caractères de type JSON', () => {
            expect(Utils.fromStringToObject('test: test')).toEqual(null);
        });

    });

    describe('vérification de la fonction getHashCode', () => {
        it('doit vérifier que la fonction retourne un nombre', () => {
            expect(Utils.getHashCode('{"test": "test"}')).not.toBeNaN();
        });

        it('doit vérifier que la fonction est pure', () => {
            expect(Utils.getHashCode('testValue')).toBe(Utils.getHashCode('testValue'));
        });
    });

    describe('vérification de la fonction getCharactersUnicodeSum', () => {
        it('doit retourner 671 pour la chaîne azerty', () => {
            expect(Utils.getCharactersUnicodeSum('azerty')).toBe(671);
        });
    });

    describe('vérification de la fonction replaceSpecialCaracters', () => {
        it('doit retourner azerty avec le paramètre azerty => chaîne de caractères correcte', () => {
            expect(Utils.replaceSpecialCaracters('azerty')).toBe('azerty');
        });

        it('doit retourner azerty avec le paramètre àzérty => chaîne de caractères correcte', () => {
            expect(Utils.replaceSpecialCaracters('àzérty')).toBe('azerty');
        });
    });

});
