export enum PinPadType {
    openingApp = 'openingApp',
    pinChangeStage1 = 'pinChangeStage1',
    pinChangeStage2 = 'pinChangeStage2',
    firstConnexionStage1 = 'firstConnexionStage1',
    firstConnexionStage2 = 'firstConnexionStage2'
}

export enum PinPadTitle {
    openingApp = 'PIN_PAD.TITLE.OPENING_APP',
    pinChangeStage1 = 'PIN_PAD.TITLE.PIN_CHANGE_STAGE_1',
    pinChangeStage2 = 'PIN_PAD.TITLE.PIN_CHANGE_STAGE_2',
    firstConnexionStage1 = 'PIN_PAD.TITLE.FIRST_CONNEXION_STAGE_1',
    firstConnexionStage2 = 'PIN_PAD.TITLE.FIRST_CONNEXION_STAGE_2'
}

export enum SecretQuestionType {
    newQuestion = 'newQuestion',
    answerToQuestion = 'answerToQuestion'
}

export enum SecretQuestionTitle {
    newQuestion = 'SECRET_QUESTION.TITLE.NEW_QUESTION',
    answerToQuestion = 'SECRET_QUESTION.TITLE.ANSWER_TO_QUESTION'
}

export enum GlobalError {
    none = 'none'
}

export enum PinPadError {
    none = 'none',
    pinIncorrect = 'pinIncorrect',
    pinInitIncorrect = 'pinInitIncorrect'
}

export enum PinPadErrorText {
    pinIncorrect = 'PIN_PAD.ERROR.PIN_INCORRECT',
    pinInitIncorrect = 'PIN_PAD.ERROR.PIN_INIT_INCORRECT'
}


export enum SecretQuestionError {
    answerIncorrect = 'answerIncorrect',
}

export enum SecretQuestionErrorText {
    answerIncorrect = 'SECRET_QUESTION.ERROR.ANSWER_INCORRECT',
}
