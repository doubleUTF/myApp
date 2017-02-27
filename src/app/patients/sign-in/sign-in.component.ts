import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.signInForm=new FormGroup({
      email:new FormControl('',[
        Validators.required,
        this.authService.validateEmail
      ]),
      password:new FormControl(null, Validators.required)
    })
  }
  signInForm:FormGroup;

  onSubmit(){
    const patient= new Patient(
      this.signInForm.value.email,
      this.signInForm.value.password
    )
    this.authService.signIn(patient)
      .subscribe(
      data=>{
        localStorage.setItem('token',data.token),
        localStorage.setItem('patientId',data.patientId);
        localStorage.setItem('firstName',data.firstName);
        localStorage.setItem('lastName',data.lastName);
        this.authService.emitName([data.firstName,data.lastName])
        this.router.navigateByUrl('/patients/dashboard')
      },
      err=>console.error(err)
    )
    this.signInForm.reset({email:''})
  }

  focusEvent= new EventEmitter<boolean>();

  ngAfterViewInit(){
    this.focusEvent.emit(true)

  }
}
