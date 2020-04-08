import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { PdfModel } from '../../models/manifex/manifex-pdf.model';

@Injectable({
  providedIn: 'root'
})
export class ManifexService {

  constructor(
    private restService: RestService,
    private urlConfiguration: UrlConfiguration
  ) { }

  /**
   * Télécharge le PDF d'une fiche manifex
   * @param manifexId l'id de la fiche à télécharger
   * @return la fiche manifex trouvée
   */
  public downloadManifexPdf(manifexId: number): Promise<PdfModel> {
    return this.restService.get(this.urlConfiguration.getBackEndUrl('downloadManifexPdfById', [manifexId]));
  }
}
