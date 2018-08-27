export enum PinPadType {
    openingApp = 'openingApp',
    pinChangeStage1 = 'pinChangeStage1',
    pinChangeStage2 = 'pinChangeStage2',
    firstConnexionStage1 = 'firstConnexionStage1',
    firstConnexionStage2 = 'firstConnexionStage2'
}

export enum PinPadTitle {
    openingApp = 'PIN_PAD.TITLE.OPENINGAPP',
    pinChangeStage1 = 'PIN_PAD.TITLE.PINCHANGESTAGE1',
    pinChangeStage2 = 'PIN_PAD.TITLE.PINCHANGESTAGE2',
    firstConnexionStage1 = 'PIN_PAD.TITLE.FIRSTCONNEXIONSTAGE1',
    firstConnexionStage2 = 'PIN_PAD.TITLE.FIRSTCONNEXIONSTAGE2'
}

export enum SecretQuestionType {
    newQuestion = 'newQuestion',
    answerToQuestion = 'answerToQuestion'
}

export enum SecretQuestionTitle {
    newQuestion = 'SECRET_QUESTION.TITLE.NEWQUESTION',
    answerToQuestion = 'SECRET_QUESTION.TITLE.ANSWERTOQUESTION'
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
    pinIncorrect = 'PIN_PAD.ERROR.PININCORRECT',
    pinInitIncorrect = 'PIN_PAD.ERROR.PININITINCORRECT'
}


export enum SecretQuestionError {
    answerIncorrect = 'answerIncorrect',
}

export enum SecretQuestionErrorText {
    answerIncorrect = 'SECRET_QUESTION.ERROR.ANSWERINCORRECT',
}
