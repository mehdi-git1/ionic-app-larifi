import { Utils } from './utils';

describe('utils', () => {

    describe('should verify the fromStringToObject function', () => {
        it('should detect if string is json type and format it ', () => {
            expect(Utils.fromStringToObject('{"test": "test"}')).toEqual({ test: 'test' });
        });

        it('should detect if string is json type and format it by replacing the \\\\ by "" ', () => {
            expect(Utils.fromStringToObject('{"test": "t\\est"}')).toEqual({ test: 'test' });
        });

        it('should detect if string is not json type and format it ', () => {
            expect(Utils.fromStringToObject('test: test')).toEqual(null);
        });

    });

    describe('should verify the getHashCode function', () => {
        it('should verify is the return is always a number', () => {
            expect(Utils.getHashCode('{"test": "test"}')).not.toBeNaN();
        });

        it('should return the same value for two same input', () => {
            expect(Utils.getHashCode('testValue')).toBe(Utils.getHashCode('testValue'));
        });
    });

    describe('should verify the getCharactersUnicodeSum function', () => {
        it('should the return the number xx for the value azerty', () => {
            expect(Utils.getCharactersUnicodeSum('azerty')).toBe(671);
        });
    });

    describe('should verify the getCharactersUnicodeSum function', () => {
        it('should the return the number xx for the value azerty', () => {
            expect(Utils.getCharactersUnicodeSum('azerty')).toBe(671);
        });
    });

    describe('should verify the replaceSpecialCaracters function', () => {
        it('should the return the string azerty for the value azerty => Test of correct string', () => {
            expect(Utils.replaceSpecialCaracters('azerty')).toBe('azerty');
        });

        it('should the return the string azerty for the value àzérty => Test of correct string', () => {
            expect(Utils.replaceSpecialCaracters('àzérty')).toBe('azerty');
        });
    });

});
