import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ScorePercentPipe } from './score-percent/score-percent.pipe';
import {ReversePipe} from './reverse/reverse.pipe';
import { TranslateOrEmptyPipe } from './translate-or-empty/translate-or-empty.pipe';


@NgModule({
	declarations: [ScorePercentPipe, ReversePipe, TranslateOrEmptyPipe],
	imports: [],
	exports: [ScorePercentPipe, ReversePipe, TranslateOrEmptyPipe],
	providers: [DatePipe]
})
export class PipesModule {}
