import { Utils } from './utils';

describe('utils', () => {

    describe('fromStringToObject', () => {
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

    describe('getHashCode', () => {
        it('doit retourner un nombre', () => {
            expect(Utils.getHashCode('{"test": "test"}')).not.toBeNaN();
        });

        it('doit être une fonction est pure', () => {
            expect(Utils.getHashCode('testValue')).toBe(Utils.getHashCode('testValue'));
        });
    });

    describe('getCharactersUnicodeSum', () => {
        it('doit retourner 671 pour la chaîne azerty', () => {
            expect(Utils.getCharactersUnicodeSum('azerty')).toBe(671);
        });
    });

    describe('replaceSpecialCaracters', () => {
        it('doit retourner azerty avec le paramètre azerty', () => {
            expect(Utils.replaceSpecialCaracters('azerty')).toBe('azerty');
        });

        it('doit retourner azerty avec le paramètre àzérty', () => {
            expect(Utils.replaceSpecialCaracters('àzérty')).toBe('azerty');
        });
    });

    describe('removeSpaces', () => {
        it('doit retourner "azerty" avec le paramètre " azer ty   "', () => {
            expect(Utils.removeSpaces(' azer ty   ')).toBe('azerty');
        });
    });

    describe('vérification de la fonction isEmpty', () => {
        it('si la valeur est undefined, la fonction doit retourner true', () => {
            expect(Utils.isEmpty(undefined)).toBe(true);
        });
        it('si la valeur est nulle, la fonction doit retourner true', () => {
            expect(Utils.isEmpty(null)).toBe(true);
        });

        it('si la valeur est vide, la fonction doit retourner true', () => {
            expect(Utils.isEmpty('')).toBe(true);
        });

        it('si la valeur ne contient que des espaces, la fonction doit retourner true', () => {
            expect(Utils.isEmpty('                         ')).toBe(true);
        });

        it('si la valeur contient au moins 1 caractère qui n\'est pas un espace, la fonction doit retourner false', () => {
            expect(Utils.isEmpty('   a   ')).toBe(false);
        });
    });

});
