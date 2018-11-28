import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicModule, NavParams } from 'ionic-angular';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SummarySheetPage } from './summary-sheet.page';
import { SummarySheetService } from './../../../../core/services/summary-sheet/summary-sheet.service';
import { TranslateLoaderMock, NavMock } from './../../../../../test-config/mocks-ionic';
import { CommonModule } from '@angular/common';


describe('SummarySheet Page', () => {

    let fixture: ComponentFixture<SummarySheetPage>;
    let comp: SummarySheetPage;
    let failureEl: DebugElement;

    const base64PDF = 'JVBERi0xLjQKJeLjz9MKNCAwIG9iaiA8PC9MZW5ndGggMjE2Ni9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nM1aW3OjOBZ+96/QW6ertm1dEcyb45BMZhObwe7sbHXmgcY4zZQNHsDZmX+7r/4XK3FJbCc+pAFvuroa4UjwHX1H56Ij/uydz3rMQCY20Gzes2e9X3sU/aL/ShBW//TV5BTNVr3BJUFE3S16Zx9nf+ix6rf6lzz0vvyuhs13HsHIX+2+hDKBDIn73Hh6E9Zvwnm/esPZMPL76DKO/CyMo580AEYPBcjeS0soLeRxOMaQwTiA5v6dfVsFjWBw3xCmSRHuC8vApm4NLnMaGEFSGEgo+E9EoiToLfZIIOpZE0luAJI52ySM50GK5h+CNPVCNEBPf1on8Vcvi8MkSLuWHCNJuJKcK8nFS8m51ecWkhji9EnMLFit48RrKuYurqSIm7zPZAFKkbmPafvfAl8Bphmabv1NEmbbEyhVCHZUqcSQfUuqbqtv8EpKReWemKN4td5mQeQrdlbbLAwSFGTI3T4sg1UQZZ6Wu/2SfzNTmyRoyNMBoJr7UcDpeuuH3jJMPW3RaOX538Koe5PDiFNSLtxXTE7wvoE4loByxuFj4G2Q404aCdeEO1nnnwjGJ5WlidCE0T2Nk0ONo6FAjAwwGVBMrDfKD0YQ3NfKLv5rZVPEpHKgROnaeKFr3WuYAKnowssClGz1otw2XYl7AhHMcokM41WJ8m7FmEGP6pkPMNd0yQ6kYcyEpMm7YYKG63WirTYLNkkX/HDMc4mIgV8VKe8HCcJSCiEFR/dnN7Zrn08+u1f3H0+wtqgUuajs9cWVd8Pkzf5ed7KomMrFckno62rU3SBnQ/uumfMo+cqXrcpjqNxZSI1NxLCKJYDf+LLvdQgUdAjkHRwChR0CgXRH8QAL7RCMrhzCcWnybpigkzgEWuMQQIIYNUyLKR7vzy7t8dCdnc4bUNgbwMx16g0o7A1AwmzHae8NcJfegHblDXYXjlQCsuO5yWX4V5GHzj/EX/8I1C5zkaIwmoeP4XwTLNPW2bBQuSaQGzlxkiG9ObKd6wpq91lu9kn+7PMj0w+esr54nejtwjJAI+9rGDneHAURetwE6m1ovn0MlvF6rQd46GK78hKV5iO13VgFic6+g9ewmKl3LHtYozjKwmij3vNftNA7t1zWJFipv2/zzWgYLeJklXOYosfQUxKlyLV/+4e+qGey8GETHCcR96lA/1Gdv5So7lVFLGN900RUOalVT6jARlj+Y9mbgk9xPUoPXuX3TOi31D1UQLFdKFYLpUY+Y+U/nsHebscUUWoAoYoSqCxwmlClJQJCFSUCSs3MAZY6VLGOQhUgTd4NE3SKUKUlgkIVTBARFueWyn3uz84nrmvf3FyfLFhpSYFgVcNdl8Eql+R4sIIp6yJYUa2YroJVvgKaBqu630eDCUbSgL2BiltpB4VSk9Yg2Z/dlhBEV0Xh2UxVPG5qtbtIZh3SeTfWB1WjTGIBBWCm61AmFkA56iKOIh1yvfkqjMI0S1RofWxdSVUmJy2w/j62x3bbJAjXgKBxvGqvZV6DcjG8u77oYtXCc3GSbdR+OlTWAd16WRL6m2UzD72XZFg1UHpzhQk2WwJxIerm1BaB1E1lGvzVmjB9/AA7lKsk3qwDdBVGf7bWDhc1YMb5dWvazBqM4WKhnLHXxSEcl3Vgv53/s210sXDNueJ09q8ODhNBiK5OLQlVkxEMWgGNUu2DuYAI5YJ2ll4UhdFD+0MiXgOIiS54EUu2nVp+xAxC5VsotWuOvDBNvchv5h++I5uEzhT1X4o8wXyZJ5hqNyqRsKAKk96ye37WOiYgISGY4TwJ0rS1K1XbZaFmdbQ+8qmDeRgEpEtpfh2nmbdsOxeL12C1nox6NayVu3DZPh/garMEw3QyEZCq2Xa5XX+LGx4M703GOrVWlO8Ea763cZiieLHo4GRdYHb8ZD33Y6PptIv0RmBaAzSM/DCIoo6+GODWcbi7MPW64I4C3LnbxTYJoiwduMFSxYFOOKTAdxc3XvSwCZrhNCKAiD2BXp7Sf0FDxNHvLSeukjuBARhdHeSNq4N7PkTurdIXSIQOMFVIzT6ZOPzAgUMfOHxBznA6tZ2JO0P3Z879R/STCtYDbCl4Sppx+v9OPIi0jn8uY7B+flwPFSguq3OARsUUJRyX2NA1NsvEXLUWtsxKNobzEntxt3y6O2z9oofTagyn6LD18xfmQ8qb/cavAJfVzX7jK2rqK3VcjRV99lTQlAe7j+kM3U5m6BO6mIzHtoum9niq7O/Wnl23rbZQYcDgRBYrE/MfY10e8KbdNMTbZOwo3hzbvRzN0HA8noxH9hRN3H93wRsETo3SoTT6KKeDgbCNYKOyEWxU6x8b6LAtbYSY1Rh1d9gWNpAPKW/2G78CXFY3+82bbYQQWNeXzkjpenRxdTG5tZHj2pejG/TzdDbqQtcQuDIQgt9T1yBvlgXT5rCSNk3ZnT2eXU/GyL2e/toBbRA2sQrPQsiPaCEq9BUGYlbxwSzCwnNTGIfayC2rm/0mX/h5d9HuXv0SY1m2u9e3GoQpYcUObVIqdji+vkXOeITsz+7E6SJmQNiEDwh5T8WCrMmaSDu06S5rtOKtA9Ig6CoBbZbqntoahFlag6gigSgCwHNTWIOsMi5ZJFrPTb7iZZkpyTxDerr6JcaybHevb7UGoyYTGNpsV6+sQ71C0FQUseHd9AqSJmpC6tDmu6TxDkmDoBVj2NCkiR/RGBRvhTGwyvWzwuc/N4Ux8Cq1KipYO02+4HmZEvE8FXq6+iXGsmx3r281BlYT82+fYr5KlG5dvZn5ufXWV2sVAqb8nbUKUkZroqlDJ4oytXM4QZoEYSvKimj6g7B2+LWOWjtCf+Ii0SdCX36to5eWVVdS/95qACQQFTyXiBHyqkR5PyhSXrH8PpH+BznkvGUKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqPDwvUGFyZW50IDUgMCBSL0NvbnRlbnRzIDQgMCBSL1R5cGUvUGFnZS9SZXNvdXJjZXM8PC9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXS9Gb250PDwvRjEgMiAwIFIvRjIgMyAwIFI+Pj4+L01lZGlhQm94WzAgMCA1OTUgODQyXT4+CmVuZG9iago3IDAgb2JqIDw8L0xlbmd0aCAyMTAwL0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicxVxdcxM3FH33r9AjfYijz1350SSGMSWJG5u+dPpQlsDQEYHyMdP+ZP5FpZWubCn4sqPVxhPgnGSFj/ZGR7rSXvuf2dPdTDRE04bs3sxWu9lvM05euJ8yQu2X+1dLTnYfZufPGGGWvZ09+WX3t2trv7dfn9/N/vjTNnvz4Hs6b2RrX5nO9UJTaXFBF9o1EIxoRsmHmWo8M5Hl2PkrnEMby3Ls+hfsmwSSQgeCBkgK3ezt/h7gtu2PPxwGQkjbVs1FDEbrYkH7q/aWnmy3O7JcKXJGLi6fk+X1+ooosrm+IKtXty5glLzzQUsEgqwL+nFprhpcm/Nzys45ZU2JUv2G9jevtOb2N64WDdUO7VDox4agpNWKKBvOM9aSz3c29oe32rK5EKS10Eh/t5wwmd7uxcf7d9+/lNyqHYoE/obOSEU4b21n+IPOuMtCzWUTxz9NO7L779NdhW5wJfp+MEp/2I/+OtqRy7++3pE3319/+zqwO4OdakPAmt6pnpnIcuz8Fa6hjWU5dv0L9k0CSaEDQQMkhWFOtdHi7LhbLjbrs83qdn1zuSLrq83NdrUabVCFS9J2jEEP781OBagSE48yFWThpovjPVpud2fb5W69fba82K1vrsnuZrd8WSXkmCyn51RUCzmmJNgYpeMNUVc2Cx5c6ZiJLMfgSvvfTWQ5etf1TQJJoQNBAySFoa5sFu0phgkqS+3SqWoNE1xJjVEqdGajkbRhwpBjsrQ5t39qhRxVWoxRKnVmo8GZDayFjuXondloCm00JTl65/VNAkmhA0EDJIXBzmzFSYYJJut+eW21YYIpMT5GqdSZDbKKv7j59ezFzavb69WKWL4av4NQuCCzCYquFuzplEo9KSV4UsJK6FiOwZMK8lzHcvSeUyFHdSSFDgQNkBQGe1IiOcfl6vnZxqawt+vdcn27Iqvr3brOKMFUbWZpXVlrlGBKjI5RKrWkQJbvaXYNqCRXNcONKulpwo2bklMwJY+LIA+L3wEGU4qY5oqQ3h6gN52AFFX43HQPHQgaICkMNiU/TT6FyXJ5zqptLlElQccolbqSIUv30+1mH/I52Sxv7Tz4sk7MMV27u7RZQ62Yo0pqjFKhNdUCznwcM5HlGKxJY55LQ357gN56FHJU6pPTPXQgaICkMNiaFMk6JrQmJsvgYLatMUxQpXaMUqE1lT7JuQ8qa2dDv82uEXJUyc6GI5RKndnCuY9jJrIcvTOVhmzXsRy983TIVB1JoQNBAySFoc5U7UnOfVBZBocQVYYJqrQYo1TqzOYkeQoq68592mohR5UWY5RKnSnh3McxE1mOwZkNpLw/+uud14R01ZEUOhA0QFIY7EyFZB6T7TFRVQqbniqjBFNicoxSqTHlSbIUVNYak1XLUlAlKzNCqdSYHA5/HDOR5RiMKWLCK0Kie4DeeAKSVeGz1D10IGiApDDYmBxJPCbc9KC6Nsf0W5Eq4wRT4nyMUqk12WnSFEzWrZl9IHSNkGNKbqtSrlRqTQpHQI6ZyHIM1mQx42Uh0z1Abz0G2SrzaeoeOhA0QFIYbE16mtQKk3UHs7LaMEGV5BilQmfKxUkeT6GyTIfdX42Qo0qcjVEqdKZs4QTIMRNZjt6ZUkPG61iOvfN8k0BS6EDQAElhqDOlfuRHaqggU2HfV2WATKdU6snmJGc/qCxva4YcU3JnP1OEHPekgrMfx0xkOQZPNpDsOpaj91wTElVHUuhA0ABJYbAn1UmSKlTWrZZttWGCKskxSqXOlMj6PdmmHlWNm/oqEceU4qZ+2ojnhcShgpcz9uNK4mEVvG/f31eqam5snirUkWpiPaeKtErE7vAH3fEl1mR5f//tzlQqtZacYaXWkrHHKbV2/cBKrfGOTFlqLWJRp4hFnSIUcx5imOBjUacMxZyH6CdwKOqUvprzADoQNEBSGDrBC6zmcftqc3Zxc/18RSzbvKwwzaByrpiz2vo/odKYaaZ3ETLNDBi91aYZKfTxaUaKuc3tJdc/n2ZW/3Z3n76+/3h/X2ey4QsipD462bjLQj/GZMP7fhyfbPhPOjLZZONC4MtvlGcmshw7f8WX3wSWY9e/YN8kkBQ6EDRAUhg22dhoYdUpVxcbshs9xUhcxB2T6TpTjJpSqahL7h1zyEHE1UU/j9cIMSZTcRZXUyodb4j6jvvaGuWZiSzH4DtfWxNYjt5XfZNAUuhA0ABJYbDvsNKTar5D61vgfU1VBsV0SoW+41ihiQtwu/y9QohRGcGqPd5RUyqV+s5XzijPTGQ5et9xXzkTWI7eV32TQFLoQNAASWGo7zhWWHK13JLr9bbGsMBkBK05LDAld0rw+M7DCklqTW2oCF9Uq3hQUyqV+s7XxSjPTGQ5Bt81kIs6lqP3VRPySEdS6EDQAElhsO+wupFqgwITiQfMVQbFdEqlrsOqRKoFGC160eF5d5UAT6dU6jpf9KI8M5HlGFwnYiYqQgZ6gN5VArJI4dPHPXQgaICkMNh1WElItUGBVrjoavXaakqlUtdhBSA+y7yuEWK0ooXVDPF0SqW+o3CqwmlcyWhYwQ4w+I7FTJSFDPQAva8YZJHMp4976EDQAElhsO+wgo+KWebPKljqDQtUSZzAeQwr8Kg1taEirN47ltSUSoW+Yy2cqrAW1jLHcvS+YxoyUcdy7H3lmwSSQgeCBkgKQ33HsKKOetMxKuP2XJXe+K2mVCr1HVbEUc13mIj76J9KH2OgplQa3PDBMyn/kOP4M6lBDzmKn0kd/6Qxq+0+buPYJ401cr4QtnsS+aSx5esvd/fd3bBnUv8Dbr2jOwplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmo8PC9QYXJlbnQgNSAwIFIvQ29udGVudHMgNyAwIFIvVHlwZS9QYWdlL1Jlc291cmNlczw8L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldL0ZvbnQ8PC9GMSAyIDAgUi9GMiAzIDAgUj4+Pj4vTWVkaWFCb3hbMCAwIDU5NSA4NDJdPj4KZW5kb2JqCjggMCBvYmpbMSAwIFIvWFlaIDAgODU0IDBdCmVuZG9iago5IDAgb2JqWzYgMCBSL1hZWiAwIDg1NCAwXQplbmRvYmoKMiAwIG9iajw8L0Jhc2VGb250L0hlbHZldGljYS9UeXBlL0ZvbnQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMyAwIG9iajw8L0Jhc2VGb250L0hlbHZldGljYS1Cb2xkL1R5cGUvRm9udC9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvU3VidHlwZS9UeXBlMT4+CmVuZG9iago1IDAgb2JqPDwvVHlwZS9QYWdlcy9Db3VudCAyL0tpZHNbMSAwIFIgNiAwIFJdPj4KZW5kb2JqCjEwIDAgb2JqPDwvTmFtZXNbKEpSX1BBR0VfQU5DSE9SXzBfMSkgOCAwIFIoSlJfUEFHRV9BTkNIT1JfMF8yKSA5IDAgUl0+PgplbmRvYmoKMTEgMCBvYmo8PC9EZXN0cyAxMCAwIFI+PgplbmRvYmoKMTIgMCBvYmo8PC9OYW1lcyAxMSAwIFIvVHlwZS9DYXRhbG9nL1BhZ2VzIDUgMCBSPj4KZW5kb2JqCjEzIDAgb2JqPDwvQ3JlYXRvcihKYXNwZXJSZXBvcnRzIFwoZmljaGVQTkNTb2xDb250ZW5ldXJcKSkvUHJvZHVjZXIoaVRleHQgMi4wLjUgXChieSBsb3dhZ2llLmNvbVwpKS9Nb2REYXRlKEQ6MjAxODExMjIyMDQ2MDVaKS9DcmVhdGlvbkRhdGUoRDoyMDE4MTEyMjIwNDYwNVopPj4KZW5kb2JqCnhyZWYKMCAxNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDIyNDkgMDAwMDAgbiAKMDAwMDAwNDgxNSAwMDAwMCBuIAowMDAwMDA0OTAyIDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwNDk5NCAwMDAwMCBuIAowMDAwMDA0NTgyIDAwMDAwIG4gCjAwMDAwMDI0MTQgMDAwMDAgbiAKMDAwMDAwNDc0NyAwMDAwMCBuIAowMDAwMDA0NzgxIDAwMDAwIG4gCjAwMDAwMDUwNTAgMDAwMDAgbiAKMDAwMDAwNTEzMCAwMDAwMCBuIAowMDAwMDA1MTYzIDAwMDAwIG4gCjAwMDAwMDUyMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEyIDAgUi9JRCBbPDNkOTQ2Y2ZmOWRhNzRjMTNjNWQ2ZGUwMzQyNmU2ZGZmPjwyYjI5MzBhMDU3NTc0NWE0Y2RkODAxMjczYzk5YzkxNT5dL0luZm8gMTMgMCBSL1NpemUgMTQ+PgpzdGFydHhyZWYKNTM4OQolJUVPRgo=';
    const summarySheetServiceMock = jasmine.createSpyObj('summarySheetServiceMock', ['getSummarySheet']);
    summarySheetServiceMock.getSummarySheet.and.returnValue(Promise.resolve(
        { summarySheet: base64PDF }
    ));

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SummarySheetPage
            ],
            imports: [
                IonicModule.forRoot(SummarySheetPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                }),
                PdfViewerModule,
                CommonModule
            ],
            providers: [
                { provide: NavParams, useClass: NavMock },
                { provide: SummarySheetService, useValue: summarySheetServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(SummarySheetPage);
        comp = fixture.componentInstance;
    });

    describe('affichage de la fiche synthèse', () => {

        beforeEach(fakeAsync(() => {
            expect(comp).toBeDefined();
            comp.initPage();
            tick();
            fixture.detectChanges();
            failureEl = fixture.debugElement.query(By.css('pdf-viewer'));
        }));

        it(`doit avoir intégrè dans le lecteur PDF le bon fichier PDF (générè dans initPage)`, () => {
            expect(comp.previewSrc).toContain(failureEl.attributes['ng-reflect-src']);
        });

        it(`doit intégrer dans le lecteur PDF le fichier PDF sous forme d'url blob`, () => {
            expect(comp.previewSrc).toContain('blob:http://localhost');
        });

    });

});
