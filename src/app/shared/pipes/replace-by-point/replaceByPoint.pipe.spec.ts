import { ReplaceByPointPipe } from './replaceByPoint.pipe';

describe('ReplaceByPointPipe', () => {
    it('doit retourner vide s\il n\'y a pas de données en paramêtre', () => {
        const pipe = new ReplaceByPointPipe();
        expect(pipe.transform('')).toEqual('');
    });

    it('doit retourner vide s\'il n\'y a un parmatére inexistant en paramétre', () => {
        const pipe = new ReplaceByPointPipe();
        const testObj = {};
        expect(pipe.transform(testObj)).toEqual('');
    });

    it('doit retourner une div de type pastille s\'il y\'a des données', () => {
        const pipe = new ReplaceByPointPipe();
        expect(pipe.transform('value')).toContain('<div class="selection-dot">');
    });
});
