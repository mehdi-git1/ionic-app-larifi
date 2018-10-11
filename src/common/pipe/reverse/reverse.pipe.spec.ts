import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
    it('should reverse the array given in paramaters', () => {
        const pipe = new ReversePipe();
        expect(pipe.transform(['s1', 's2', 's3'])).toEqual(['s3', 's2', 's1']);
    });
});
