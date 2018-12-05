import { ReplaceByPointPipe } from './replace-by-point/replaceByPoint.pipe';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ScorePercentPipe } from './score-percent/score-percent.pipe';
import { ReversePipe } from './reverse/reverse.pipe';


@NgModule({
	declarations: [ScorePercentPipe, ReversePipe, ReplaceByPointPipe],
	imports: [],
	exports: [ScorePercentPipe, ReversePipe, ReplaceByPointPipe],
	providers: [DatePipe]
})
export class PipesModule { }
