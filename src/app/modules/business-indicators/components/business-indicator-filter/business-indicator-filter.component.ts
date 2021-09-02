import * as moment from 'moment';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BusinessIndicatorFilterModel } from 'src/app/core/models/business-indicator/business-indicator-filter-model';
import { distinctUntilChanged, filter, first } from 'rxjs/operators';

@Component({
  selector: 'business-indicator-filter',
  templateUrl: './business-indicator-filter.component.html',
  styleUrls: ['./business-indicator-filter.component.scss'],
})
export class BusinessIndicatorFilterComponent implements OnInit, AfterViewInit {

  @Output() comparisonLaunched = new EventEmitter<BusinessIndicatorFilterModel>();
  @Output() comparisonCanceled = new EventEmitter();
  @Input() disabledComparisonLaunchButton = false;

  filtersForm: FormGroup;
  businessIndicatorFilter: BusinessIndicatorFilterModel;
  minStartDate: string;
  MINIMAL_DATE = '2019-01-01';
  MONTH_INTERVAL = 6;

  constructor(private translateService: TranslateService, private formBuilder: FormBuilder) {
  }


  ngOnInit() {
    this.businessIndicatorFilter = new BusinessIndicatorFilterModel();
    this.minStartDate = moment(this.MINIMAL_DATE).format('YYYY-MM-DD');
    this.initFiltersForm();
    this.enableDatesOnChange();
  }

  ngAfterViewInit(): void {
    this.resetFilters();
  }

  /**
   * Remplit les dates de la deuxième période, lorsque le choix est fait
   * de comparer par rapport à l'année dernière.
   */
  lastYearComparisonChange(): void {
    this.filtersForm.patchValue({
      compareWithPopulation: false,
      compareWithLastPeriod: false
    });
    this.setFiltersToLastYear();
  }


  /**
   * Remplit les dates de la deuxième période, lorsque le choix est fait
   * de comparer par rapport à la période précedant la première période.
   */
  lastPeriodComparisonChange(): void {
    this.filtersForm.patchValue({
      compareWithPopulation: false,
      compareWithLastYear: false
    });
    this.setFiltersTotLastPeriod();
  }

  /**
   * Gère la comparaison par rapport à la population sur la période renseignée.
   * Les sécondes périodes sont remplies à la date du jour afin de rendre la validation
   * possible.
   */
  comparisonWithPopulationChange(): void {
    this.filtersForm.patchValue({
      compareWithLastYear: false,
      compareWithLastPeriod: false,
      secondPeriodStartDate: this.getDateOfTheDay(),
      secondPeriodEndDate: this.getDateOfTheDay()
    });
    this.businessIndicatorFilter = this.filtersForm.value;
  }


  /**
   * Initialise le formulaire des filtres.
   */
  initFiltersForm(): void {
    this.filtersForm = this.formBuilder.group({
      firstPeriodStartDate: ['', Validators.required],
      firstPeriodEndDate: ['', Validators.required],
      compareWithPopulation: [false],
      compareWithLastPeriod: [false],
      compareWithLastYear: [false],
      secondPeriodStartDate: ['', Validators.required],
      secondPeriodEndDate: ['', Validators.required]
    }
    );
  }

  /**
   * Active pour les différentes dates, un observateur permettant de remplir
   * automatique à six mois d'écart la de fin ou de début pour chaque période
   */
  enableDatesOnChange(): void {
    this.dateOnChanges('firstPeriodStartDate', 'firstPeriodEndDate', this.addMonths);
    this.dateOnChanges('secondPeriodStartDate', 'secondPeriodEndDate', this.addMonths);
    this.dateOnChanges('firstPeriodEndDate', 'firstPeriodStartDate', this.substractMonths);
    this.dateOnChanges('secondPeriodEndDate', 'secondPeriodStartDate', this.substractMonths);
  }


  /**
   * Fonction générique permettant de s'abonner aux changements de valeurs
   * du controle @param{dateControlToObserve} et mettant à jour la valeur du control @param{dateControlToUpdate}
   * en lui appliquant la fonction passée en paramètre.
   *
   * @param dateControlToObserve le nom  du control à observer
   * @param dateControlToUpdate le nom du control à mettre à jour
   * @param fn la fonction à appliquer au control
   */
  dateOnChanges(dateControlToObserve: string, dateControlToUpdate: string, fn: (amount: number, date?: string) => string): void {
    this.filtersForm.get(dateControlToObserve).valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0)
      ).subscribe(value => {
        this.filtersForm.get(dateControlToUpdate).patchValue(fn(this.MONTH_INTERVAL, value));
      })
  }

  /**
   * Emet les valeurs renseignées dans le filtre
   * afin de lancer la comparaison
   */
  launchComparison() {
    this.businessIndicatorFilter = this.filtersForm.value;
    this.comparisonLaunched.emit(this.businessIndicatorFilter);
  }

  /**
   *  Emet afin d'avertir de l'annulation de la comparaison
   */
  cancelComparison() {
    this.comparisonCanceled.emit();
  }

  /**
   * ajoute à la date passée en paramètre, le nombre de mois passé en paramètre.
   * Si aucune date n'est passée, ajoute à la date courante, le nombre de mois.
   *
   * @param  amount le nombre de mois à rajouter
   * @param date la date à partir de laquelle ajouter, sinon la date du jour est prise en compte
   * @returns la nouvelle date
   */
  addMonths(amount: number, date?: string): string {
    date = date ? date : this.getDateOfTheDay();
    return moment(date).add(amount, 'months').toISOString();
  }

  /**
   * soustrait à la date passée en paramètre, le nombre de mois passé en paramètre.
   * Si aucune date n'est passée, ajoute à la date courante, le nombre de mois.
   * @param amount le nombre de mois à soustraire, sinon la date du jour est prise en compte
   * @param date la date à partir de laquelle soustraire
   * @returns la nouvelle date
   */
  substractMonths(amount: number, date?: string): string {
    date = date ? date : this.getDateOfTheDay();
    return moment(date).subtract(amount, 'months').toISOString();
  }

  /**
   * Détermine si le bouton de validation doit être désactivé
   * @returns true si le formulaire est invalide ou le paramètre de désactivation est vrai. False sinon
   */
  isComparisonLaunchDisabled(): boolean {
    return (this.disabledComparisonLaunchButton || this.filtersForm.invalid);
  }


  /**
   * Détermine si les champs date sont sélectionnables dans le formulaire.
   * @returns vrai si selectable, faux sinon.
   */
  isPeriodSelectable(): boolean {
    return this.businessIndicatorFilter &&
      !this.businessIndicatorFilter.compareWithLastPeriod &&
      !this.businessIndicatorFilter.compareWithLastYear;
  }



  /**
   * Réinitilise les filtres aux valeurs passées dans l'objet si le paramètre existe
   * sinon, réinitialise aux valeurs par défaut.
   * @param filters les valeurs du filtre auxquels on souhaiterait réinitialiser le formulaire
   */
  resetFilters(filters?: BusinessIndicatorFilterModel) {
    this.businessIndicatorFilter = (filters === undefined) ? this.getFiltersInitValue() : filters;
    this.filtersForm.reset(this.businessIndicatorFilter);
  }



  /**
   * Définit les valeurs des dates de la seconde période aux dates correspondant
   * à la période précédant la première.
   */
  setFiltersTotLastPeriod(): void {
    this.filtersForm.patchValue({
      secondPeriodEndDate: moment(this.filtersForm.get('firstPeriodStartDate').value).subtract(1, 'days').toISOString(),
      secondPeriodStartDate: moment(this.filtersForm.get('firstPeriodStartDate').value)
        .subtract(1, 'days')
        .subtract(6, 'months').toISOString()
    }, { emitEvent: false });

    this.businessIndicatorFilter = this.filtersForm.value;
  }
  /**
   * Vérifie que la comparaison par rapport à la population de référence
   * est le filtre choisi
   * @returns vrai si la comparaison est faite par rapport à la population, faux sinon.
   */
  isComparisonToPopulation(): boolean {
    return this.businessIndicatorFilter && this.businessIndicatorFilter.compareWithPopulation;
  }

  /**
   * Défnit les valeurs des date de la seconde périodes aux même dates de l'année n-1
   */
  setFiltersToLastYear() {
    this.filtersForm.patchValue({
      secondPeriodEndDate: moment(this.filtersForm.get('firstPeriodEndDate').value).subtract(1, 'year').toISOString(),
      secondPeriodStartDate: moment(this.filtersForm.get('firstPeriodStartDate').value).subtract(1, 'year').toISOString()
    }, { emitEvent: false });

    this.businessIndicatorFilter = this.filtersForm.value;
  }


  /**
   * Retourne la date du jour
   * @returns la date du jour
   */
  getDateOfTheDay(): string {
    return moment().toISOString();
  }

  /**
  * Remet le filtre aux valeurs par défaut
  * @returns le filtre aux valeurs par défaut.
  */
  getFiltersInitValue(): BusinessIndicatorFilterModel {
    this.businessIndicatorFilter.firstPeriodStartDate = this.substractMonths(6);
    this.businessIndicatorFilter.firstPeriodEndDate = this.getDateOfTheDay();
    this.businessIndicatorFilter.compareWithLastPeriod = false;
    this.businessIndicatorFilter.compareWithLastYear = false;
    this.businessIndicatorFilter.compareWithPopulation = false;
    this.businessIndicatorFilter.secondPeriodStartDate = '';
    this.businessIndicatorFilter.secondPeriodEndDate = '';
    return this.businessIndicatorFilter;
  }

}








