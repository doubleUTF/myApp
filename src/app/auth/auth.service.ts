import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms'; // Just for validating email
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operator/map';
import { Router } from '@angular/router';
import { Patient } from '../patients/patient.model';
import { environment as env } from '../../environments/environment';

@Injectable()
export class AuthService {

  private nameSource= new BehaviorSubject([]);

  name$=this.nameSource.asObservable();
  emitName(nameArray:Array<string>){
    this.nameSource.next(nameArray)
  }

  public upcomingAppointments=new BehaviorSubject([]);

  emitUpcomingAppointments(appointmentsArray:Array<any>){
    this.upcomingAppointments.next(appointmentsArray)
  }

  public formCompleteSource=new BehaviorSubject(false);

  emitFormComplete(e:boolean){
    this.formCompleteSource.next(e)
  }

  constructor(private http:Http, private router:Router) { }

  register(patient:Patient){
    const body=JSON.stringify(patient);
    const headers= new Headers({'Content-Type':'application/json'});
    return this.http.post(env.DOMAIN + '/patients/register', body, {headers})
      .map((res:Response)=>res.json())
      .catch((error:Response)=>Observable.throw(error))
  }

  signIn(patient:Patient){
    const body=JSON.stringify(patient);
    const headers= new Headers({'Content-Type':'application/json'})
    return this.http.post(env.DOMAIN + '/patients/signin',body, {headers})
      .map((res:Response)=>res.json())
      .catch((error:Response)=>Observable.throw(error.json()))
  }

  signOut(){
    const token= localStorage.getItem('token') ? localStorage.getItem('token') :''
    const headers= new Headers({'Content-Type':'application/json','x-auth': token})
    this.http.delete(env.DOMAIN + '/patients/token', {headers})
      .map((res:Response)=>res.json())
      .catch((error:Response)=>Observable.throw(error.json()))
      .subscribe((data)=>{
        localStorage.clear();
        this.router.navigate(['/patients','signin'])
      },
        (err)=>{
          localStorage.clear();
          this.router.navigate(['/patients','signin'])
        })
  }

  isLoggedIn():Observable<boolean>{
    const token= localStorage.getItem('token') ? localStorage.getItem('token') :''
    const headers= new Headers({'Content-Type':'application/json','x-auth': token})
    return this.http.get(env.DOMAIN + '/patients/auth',{headers})
      .map(response=>response.json())
      .catch((error:Response)=>Observable.throw(error.json()))
  }

  getPatientInfo(){
    const token= localStorage.getItem('token') ? localStorage.getItem('token') :''
    const headers= new Headers({'Content-Type':'application/json','x-auth': token})
    return this.http.get(env.DOMAIN + '/patients/me', {headers})
      .map((res:Response)=>res.json())
      .catch((error:Response)=>Observable.throw(error.json()))
  }
}
