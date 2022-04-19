import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import List from './models/list';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly ROOT_URL;
  constructor(private http: HttpClient ) {
    this.ROOT_URL = "https://git.heroku.com/task-manager-mean-stack-webapp.git";
   }
   get(uri: string){
     return this.http.get<[]>(`${this.ROOT_URL}/${uri}`);
   }
   post(uri: string,payload: Object){
     return this.http.post(`${this.ROOT_URL}/${uri}`,payload);
   }
   patch(uri: string,payload: Object){
     return this.http.patch(`${this.ROOT_URL}/${uri}`,payload);
   }
   delete(uri: string){
     return this.http.delete(`${this.ROOT_URL}/${uri}`);
   }
   login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }
  signup(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }
}
