import { ReplaceByPointPipe } from './replace-by-point/replaceByPoint.pipe';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ScorePercentPipe } from './score-percent/score-percent.pipe';
import { ReversePipe } from './reverse/reverse.pipe';
import { TranslateOrEmptyPipe } from './translate-or-empty/translate-or-empty.pipe';
import { IsMyPage } from './is_my_page/is_my_page.pipe';


@NgModule({
	declarations: [
		ScorePercentPipe,
		ReversePipe,
		ReplaceByPointPipe,
		TranslateOrEmptyPipe,
		IsMyPage
	],
	imports: [],
	exports: [
		ScorePercentPipe,
		ReversePipe,
		ReplaceByPointPipe,
		TranslateOrEmptyPipe,
		IsMyPage
	],
	providers: [DatePipe, IsMyPage]
})
export class PipesModule { }
