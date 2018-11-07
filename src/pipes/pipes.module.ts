import { NgModule } from '@angular/core';
import { ScorePercentPipe } from './score-percent/score-percent';
import { ReversePipe } from '../common/pipe/reverse/reverse.pipe';
import { DatePipe } from '@angular/common';
@NgModule({
	declarations: [ScorePercentPipe, ReversePipe],
	imports: [],
	exports: [ScorePercentPipe, ReversePipe],
	providers: [DatePipe]
})
export class PipesModule {}
