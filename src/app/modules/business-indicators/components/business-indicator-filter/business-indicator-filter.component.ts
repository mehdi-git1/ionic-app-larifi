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
  lastPeriodComparisonChecked = false;
  lastYearComparisonChecked = false;

  constructor(private translateService: TranslateService, private formBuilder: FormBuilder) {
  }


  ngOnInit() {
    this.businessIndicatorFilter = new BusinessIndicatorFilterModel();
    this.minStartDate = moment('2019-01-01').format('YYYY-MM-DD');
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
    this.lastYearComparisonChecked = !this.lastYearComparisonChecked
    this.lastPeriodComparisonChecked = false;
    this.setFiltersToLastYear();
  }


  /**
   * Remplit les dates de la deuxième période, lorsque le choix est fait
   * de comparer par rapport à la période précedant la première période.
   */
  lastPeriodComparisonChange(): void {
    this.lastPeriodComparisonChecked = !this.lastPeriodComparisonChecked;
    this.lastYearComparisonChecked = false;
    this.setFiltersTotLastPeriod();
  }


  /**
 * Initialise le formulaire des filtres
 */
  initFiltersForm(): void {
    this.filtersForm = this.formBuilder.group({
      firstPeriodStartDate: ['', Validators.required],
      firstPeriodEndDate: ['', Validators.required],
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
        this.filtersForm.get(dateControlToUpdate).patchValue(fn(6, value));
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
   * @returns la nouvelle date
   */
  addMonths(amount: number, date?: string): string {
    date = date ? date : this.getDateOfTheDay();
    return moment(date).add(amount, 'months').toISOString();
  }

  /**
   * soustrait à la date passée en paramètre, le nombre de mois passé en paramètre.
   * Si aucune date n'est passée, ajoute à la date courante, le nombre de mois.
   * @param amount
   * @param date
   * @returns
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
  * @returns true si selectable, false sinon.
  */
  isPeriodSelectable(): boolean {
    return !this.lastPeriodComparisonChecked && !this.lastYearComparisonChecked;
  }


  /**
    * Réinitilise les filtres aux valeurs passées dans l'objet si le paramètre existe
    * sinon, réinitialise aux valeurs par défaut.
    */
  resetFilters(filter?: BusinessIndicatorFilterModel) {
    this.businessIndicatorFilter = (filter == undefined) ? this.getFiltersInitValue() : filter;
    this.filtersForm.reset(this.businessIndicatorFilter);
  }



  /**
   * Définit les valeurs des dates de la seconde période aux dates correspondant
   * à la période précédant la première.
   */
  setFiltersTotLastPeriod(): void {
    this.businessIndicatorFilter.secondPeriodEndDate = moment(this.businessIndicatorFilter.firstPeriodStartDate).subtract(1, 'days').toISOString();
    this.businessIndicatorFilter.secondPeriodStartDate = moment(this.businessIndicatorFilter.secondPeriodEndDate).subtract(6, 'months').toISOString();
    this.resetFilters(this.businessIndicatorFilter);
  }

  /**
   * Défnit les valeurs des date de la seconde périodes aux même dates de l'année n-1
   */
  setFiltersToLastYear() {
    this.businessIndicatorFilter.secondPeriodEndDate = moment(this.businessIndicatorFilter.firstPeriodEndDate).subtract(1, 'year').toISOString();
    this.businessIndicatorFilter.secondPeriodStartDate = moment(this.businessIndicatorFilter.firstPeriodStartDate).subtract(1, 'year').toISOString();
    this.resetFilters(this.businessIndicatorFilter);
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
    this.lastPeriodComparisonChecked = false;
    this.lastYearComparisonChecked = false;
    this.businessIndicatorFilter.secondPeriodStartDate = '';
    this.businessIndicatorFilter.secondPeriodEndDate = '';
    return this.businessIndicatorFilter;
  }

}








