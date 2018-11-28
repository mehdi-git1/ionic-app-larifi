export class EvaluationSheetModel {
    title: string;
    evaluations: Array<{
        text: string;
        types: {
            E1?: string,
            E2?: string,
            FC?: string,
            NA?: string
        };
    }>;
}
