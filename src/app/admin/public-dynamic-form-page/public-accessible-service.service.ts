import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicAccessibleServiceService {

  constructor(private http: HttpClient) { }

  public getFormQuestionnaire(id: any): Observable<Object> {
    return this.http.get("assets/data.json");
  }
}
