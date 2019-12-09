import { StatutoryCertificateModel } from './../../../../core/models/statutory.certificate.model';
import { Component, Input, OnInit } from '@angular/core';
import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';


@Component({
    selector: 'statutory-certificate',
    templateUrl: 'statutory-certificate.component.html',
    styleUrls: ['./statutory-certificate.component.scss']
})
export class StatutoryCertificateComponent {

    @Input() statutoryCertificate: StatutoryCertificateModel;

    StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;
}
