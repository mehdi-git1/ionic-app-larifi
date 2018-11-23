import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
    it('doit inverser le tableau entré en paramètre', () => {
        const pipe = new ReversePipe();
        expect(pipe.transform(['s1', 's2', 's3'])).toEqual(['s3', 's2', 's1']);
    });
});
