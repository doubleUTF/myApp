import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { ModalModule, ModalDirective } from 'ng2-bootstrap/modal';

@Component({
  selector: 'appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {

  constructor(private appointmentService:AppointmentService) { }

  upcomingAppointments=[];
  pastAppointments=[];
  selectedAppointment={date:null}

  alertStatus=false
  alertMessage:string=''
  @ViewChild('staticModal') public staticModal:ModalDirective;

  ngOnInit() {
    this.appointmentService.getAppointments()
      .subscribe(
        data=>{
          this.upcomingAppointments=data.upcomingAppointments,
          this.pastAppointments=data.pastAppointments
        },
        err=>console.error(err)
      )
  }

  onCanceled(appointment){
    // console.log(appointment)
    this.selectedAppointment=appointment
    this.staticModal.show()
  }

  confirmCancel(id:Number){
    this.appointmentService.cancelAppointment(id)
      .subscribe(
        data=>{
          this.upcomingAppointments.splice(this.upcomingAppointments.indexOf(id),1)
          this.staticModal.hide()
          let message=`Your appointment on <b>${this.appointmentService.formatTime(this.selectedAppointment.date)}</b>
          has been canceled.`
          this.showAlert(message);
        },
        err=>console.error(err)
      )
  }

  showAlert(message:string){
    this.alertMessage=message;
    this.alertStatus=true
  }
}
