import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {

  constructor(private localStorageService: LocalStorageService) { }

  getTemplates(): Promise<any> {
    return this.localStorageService.getDataFromIndexedDB("questionair");
  }

  saveTemplates(name: string, formData: any): Promise<any> {
    return this.localStorageService.setDataInIndexedDB(name, formData);
  }

  deleteTemplates(name: string): Promise<any> {
    return this.localStorageService.removeDataFromIndexedDB(name);
  }
}
