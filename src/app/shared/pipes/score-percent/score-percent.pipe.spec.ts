import { ScorePercentPipe } from './score-percent.pipe';

describe('ScorePercentPipe', () => {

    it('100 doit se transformer en 100', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('100')).toEqual(100);
    });

    it('00,01 doit se transformer en 0', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('00.01')).toEqual(0);
    });

    it('99,99999 doit se transformer en 99,9', () => {
        const pipe = new ScorePercentPipe();
        expect(pipe.transform('99.99999')).toEqual(99.9);
    });
});
