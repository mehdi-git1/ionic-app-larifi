import { Parameters } from './../../models/Parameters';
import { SessionService } from './../../services/session.service';
import { PncHomePage } from './../pnc-home/pnc-home';
import { Observable } from 'rxjs/Rx';
import { GenderProvider } from './../../providers/gender/gender';
import { AppConfig } from './../../app/app.config';
import { PncFilter } from './../../models/pncFilter';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Assignment } from '../../models/assignment';
import { Speciality } from '../../models/speciality';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'page-pnc-search',
  templateUrl: 'pnc-search.html',
})
export class PncSearchPage {

  pncList: Observable<Pnc[]>;
  filteredPncs: Pnc[];
  searchForm: FormGroup;
  pncMatriculeControl: AbstractControl;
  selectedPnc: Pnc;
  pncFilter: PncFilter;
  connectedPncDivision: string;
  sectorList: string[];
  ginqList: string[];
  relayList: string[];
  aircraftSkillList: string[];
  specialityList: string[];
  totalPncs: number;
  pageSize: number;
  pageSizeOptions: number[];
  itemOffset: number;

  searchTerms = new Subject<string>();



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private genderProvider: GenderProvider,
    private sessionService: SessionService) {


    // Initialisation du formulaire
    this.initForm();
    this.initFilter();
  }

  ionViewDidLoad() {
    this.totalPncs = 0;
    this.pageSize = AppConfig.pageSize;
  }

  initFilter() {
    this.pncFilter = new PncFilter();
    this.pageSize = AppConfig.pageSize;
    this.itemOffset = 0;
    this.specialityList = Object.keys(Speciality)
      .map(k => Speciality[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.parameters !== undefined) {
      const params: Map<string, any> = this.sessionService.parameters.params;
      this.connectedPncDivision = Object.keys(params['division'])[0];
      this.sectorList = Object.keys((params['division'])[this.connectedPncDivision]);
      this.relayList = params['relay'];
      this.aircraftSkillList = params['aircraftSkill'];
    }


  }

  initAutocompleteList() {
    this.pncList = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(
        term => (term ? this.pncProvider.pncAutoComplete(term) : Observable.of<Pnc[]>([]))
      )
      .catch(error => {
        return Observable.of<Pnc[]>([]);
      });
  }

  prepareFilter(): void {
    if (this.selectedPnc) {
      this.pncFilter.pncMatricule = this.selectedPnc.matricule;
    }
  }

  /**
   * Ajoute un terme au flux
   * @param term le terme à ajouter
   */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /**
  * Affiche le PN dans l'autocomplete
  *  @param pn le PN sélectionné
  */
  displayPnc(pnc: Pnc) {
    return pnc
      ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
      : pnc;
  }

  /**
 * redirige vers la page d'accueil du pnc ou du cadre
 * @param pnc le pnc concerné
 */
  openPncHomePage(pnc: Pnc) {
    this.selectedPnc = undefined;
    this.initAutocompleteList();
    this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = this.formBuilder.group({
      pncMatriculeControl: [
        '',
        Validators.compose([Validators.minLength(8), Validators.maxLength(8)])
      ],
      sectorControl: [''],
      ginqControl: [''],
      specialityControl: [''],
      aircraftSkillControl: [''],
      relayControl: [''],
    });

    this.pncMatriculeControl = this.searchForm.get('pncMatriculeControl');

    this.initAutocompleteList();
  }

  /**
   * compare deux valeur et  renvois truc si elles sont égales
   * @param e1 premiere valeur a comparée
   * @param e2 Deuxieme valeur à comparée
   */
  compareFn(e1: string, e2: string): boolean {
    if (e1 === e2) {
      return true;
    }
    return false;
  }

  /**
   * recupere 10 pnc correspondant aux criteres saisis du filtre.
   */
  searchPncs() {
    this.buildFilter();
    this.pncProvider.getfilteredPncs(this.pncFilter).then(pagedPnc => {
      this.filteredPncs = pagedPnc.content;
      this.totalPncs = pagedPnc.page.totalElements;
    });
  }

  buildFilter() {
    // Pagination
    this.pncFilter.page = this.itemOffset / this.pageSize;
    this.pncFilter.size = this.pageSize;
    this.filteredPncs = [];
  }

  /**
   * Permet de rechanrger les éléments dans la liste à scroller quand on arrive a la fin de la liste.
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.filteredPncs.length < this.totalPncs) {
          this.pncFilter.page = ++this.pncFilter.page;
          this.pncProvider.getfilteredPncs(this.pncFilter).then(pagedPnc => {
            this.filteredPncs.push(...pagedPnc.content);
          });
        } else {
          infiniteScroll.enable(false);
        }
        resolve();
      }, 500);
    });
  }

}
