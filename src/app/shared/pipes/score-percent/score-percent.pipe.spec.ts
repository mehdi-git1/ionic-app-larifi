import { ScorePercentPipe } from './score-percent.pipe';

describe('ScorePercentPipe', () => {

    it('100 doit se transformer en 100', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('100')).toEqual(100);
    });

    it('0 doit se transformer en 0', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('0')).toEqual(0);
    });

    it('00,01 doit se transformer en 0', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('00.01')).toEqual(0);
    });

    it('99,99999 doit se transformer en 99', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('99.99999')).toEqual(99);
    });

    it('99,99999 doit se transformer en 99,9 si l\'on veut 1 chiffre après la virgule', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('99.99999', 1)).toEqual(99.9);
    });
});
