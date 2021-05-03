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
  secondPeriodStartDateMin: string;
  lastPeriodComparisonChecked = false;
  lastYearComparisonChecked = false;

  constructor(private translateService: TranslateService, private formBuilder: FormBuilder) {

  }


  ngOnInit() {
    this.businessIndicatorFilter = new BusinessIndicatorFilterModel();
    this.secondPeriodStartDateMin = moment('2019-01-01').format('YYYY-MM-DD');
    this.initFiltersForm();
    this.startDateOnChanges();
    this.endDateOnChanges();
  }

  ngAfterViewInit(): void {
    this.resetFilters();
  }

  /**
   *
   * @param checked
   */
  lastYearComparisonChange(): void {
    console.log('years changed' + this.lastYearComparisonChecked);
    this.lastYearComparisonChecked = !this.lastYearComparisonChecked
    this.lastPeriodComparisonChecked = false;
    console.log('years changed' + this.lastYearComparisonChecked);
    this.setFiltersToLastYear();
  }

  /**
   *
   * @param checked
   */

  lastPeriodComparisonChange(): void {
    console.log('Period changed' + this.lastPeriodComparisonChecked);
    this.lastPeriodComparisonChecked = !this.lastPeriodComparisonChecked;
    this.lastYearComparisonChecked = false;
    console.log('Period changed' + this.lastPeriodComparisonChecked);
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
   *
   */
  startDateOnChanges(): void {
    // First Period
    this.filtersForm.get('firstPeriodStartDate').valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0)
      ).subscribe(value => {
        this.filtersForm.patchValue({
          firstPeriodEndDate: this.addMonths(6, value)
        })
      })

    // Second Period
    this.filtersForm.get('secondPeriodStartDate').valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0)
      ).subscribe(value => {
        this.filtersForm.patchValue({
          secondPeriodEndDate: this.addMonths(6, value)
        })
      })
  }

  /**
   *
   */
  endDateOnChanges(): void {
    this.filtersForm.get('firstPeriodEndDate').valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0)
      ).subscribe(value => {
        this.filtersForm.patchValue({
          firstPeriodStartDate: this.substractMonths(6, value)
        })
      });

    this.filtersForm.get('secondPeriodEndDate').valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0)
      ).subscribe(value => {
        this.filtersForm.patchValue({
          secondPeriodStartDate: this.substractMonths(6, value)
        })
      })
  }

  cancelComparison() {
    this.comparisonCanceled.emit();
  }

  /**
   *
   */
  launchComparison() {
    this.businessIndicatorFilter = this.filtersForm.value;
    this.comparisonLaunched.emit(this.businessIndicatorFilter);
  }


  /**
   * ajoute à la date passée en paramètre, le nombre de mois passé en paramètre.
   * Si aucune date n'est passé, ajoute à la date courante, le nombre de mois.
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
   * Si aucune date n'est passé, ajoute à la date courante, le nombre de mois.
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
  * @returns
  */
  isPeriodSelectable(): boolean {
    return !this.lastPeriodComparisonChecked && !this.lastYearComparisonChecked;
  }


  /**
    * Réinitilise les filtres aux valeurs passées dans l'objet si le paramètre existe
    * sinon, réinitialise aux valeurs initiales.
    */
  resetFilters(filter?: BusinessIndicatorFilterModel) {
    this.businessIndicatorFilter = (filter == undefined) ? this.getFiltersInitValue() : filter;
    this.filtersForm.reset(this.businessIndicatorFilter);
  }



  /**
   *
   */
  setFiltersTotLastPeriod(): void {
    this.businessIndicatorFilter.secondPeriodEndDate = moment(this.businessIndicatorFilter.firstPeriodStartDate).subtract(1, 'days').toISOString();
    this.businessIndicatorFilter.secondPeriodStartDate = moment(this.businessIndicatorFilter.secondPeriodEndDate).subtract(6, 'months').toISOString();
    this.resetFilters(this.businessIndicatorFilter);
  }

  /**
   *
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
  * Remets le filtre aux valeurs initiales
  * @returns le filtre aux valeurs initiales.
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








