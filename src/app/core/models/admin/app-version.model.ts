export class AppVersionModel {
    number: string;
    changelog: string;

    constructor(number: string, changelog: string) {
        this.number = number;
        this.changelog = changelog;
    }
}
