import { Observable } from 'rxjs';

import { HostListener, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CanDeactivate } from '@angular/router';

import { CancelChangesService } from '../../core/services/cancel_changes/cancel-changes.service';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

    constructor(
        private cancelChangesService: CancelChangesService) {
    }

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | Promise<boolean> {
        if (!component.canDeactivate()) {
            return this.confirmCancelChanges();
        }
        return Promise.resolve(true);
    }

    async confirmCancelChanges() {
        return this.cancelChangesService.openCancelChangesPopup();
    }
}

@Injectable()
export abstract class ComponentCanDeactivate {
    abstract canDeactivate(): boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
        }
    }
}

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

    abstract get form(): NgForm;

    canDeactivate(): boolean {
        return !this.form.dirty;
    }
}
