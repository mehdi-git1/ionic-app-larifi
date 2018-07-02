import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Entity } from '../../models/entity';


@Injectable()
export class OfflineCareerObjectiveProvider {

  constructor(private storageService: StorageService) {
  }

  store(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.createOrUpdate(careerObjective);
  }

  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.storageService.saveAsync(Entity.CAREER_OBJECTIVE, careerObjective);
  }

  getPncCareerObjectives(pncMatricule: string): Promise<CareerObjective[]> {
    return new Promise((resolve, reject) => {
      const careerObjectiveList = this.storageService.findAll(Entity.CAREER_OBJECTIVE);
      const pncCareerObjectives = careerObjectiveList.filter(careerObjective => {
        return careerObjective.pnc.matricule === pncMatricule;
      });
      resolve(pncCareerObjectives);
    });
  }

  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.storageService.findOneAsync(Entity.CAREER_OBJECTIVE, `${id}`);
  }

  delete(id: number): Promise<CareerObjective> {
    return this.storageService.deleteAsync(Entity.CAREER_OBJECTIVE, `${id}`);
  }

}
