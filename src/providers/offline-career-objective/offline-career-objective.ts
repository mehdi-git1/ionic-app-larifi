import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Entity } from '../../models/entity';


@Injectable()
export class OfflineCareerObjectiveProvider {

  constructor(private storageService: StorageService) {
  }

  save(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.storageService.save(Entity.CAREER_OBJECTIVE, careerObjective);
  }

  getPncCareerObjectives(pncMatricule: string): Promise<CareerObjective[]> {
    return new Promise((resolve, reject) => {
      this.storageService.findAll(Entity.CAREER_OBJECTIVE).then(careerObjectiveList => {
        console.log(careerObjectiveList);
        const pncCareerObjectives = careerObjectiveList.filter(careerObjective => {
          return careerObjective.pnc.matricule === pncMatricule;
        });
        resolve(pncCareerObjectives);
      });
    });
  }

  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.storageService.findOne(Entity.CAREER_OBJECTIVE, `${id}`);
  }

}
