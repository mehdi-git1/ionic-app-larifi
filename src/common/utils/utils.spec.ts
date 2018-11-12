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

});
