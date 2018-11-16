import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ScorePercentPipe } from './score-percent/score-percent';
import {ReversePipe} from './reverse/reverse.pipe';


@NgModule({
	declarations: [ScorePercentPipe, ReversePipe],
	imports: [],
	exports: [ScorePercentPipe, ReversePipe],
	providers: [DatePipe]
})
export class PipesModule {}
