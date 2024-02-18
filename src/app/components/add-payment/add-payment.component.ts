import { Component, OnInit } from '@angular/core';
import { ReceptionistService } from '../../services/receptionist/receptionist.service';
import { PaymentByRecDto } from 'src/app/interfaces/paymentByRecDto.model';
import { PaymentDto } from 'src/app/interfaces/paymentDto.model';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit{
  paymentData: PaymentByRecDto = {
    date: '',
    memberName: '',
    id: 0
  };
  payments: PaymentDto[]=[];
  membersNames: any[] = [];
  errMessage: string = '';


  constructor(private receptionistService: ReceptionistService) { }

  ngOnInit(): void {
    this.getAllPayments();
    this.loadMembersNames();
  }


  makePayment(): void {
    if (!this.paymentData.date) {
      this.errMessage = 'Please select a date.';
      return;
    }
    const token = localStorage.getItem('token');

    const memberName = this.paymentData.memberName;
    const memName = memberName.replace(/\s+/g, ''); // Uklanja sve beline znake
    const isValidMember = this.membersNames.some(member =>
      (member.firstName.toLowerCase() + member.lastName.toLowerCase()) === memName.toLowerCase()
    );
    if (!isValidMember) {
      this.errMessage = 'Invalid member name. Please enter a valid member name.';
      return;
    }

    if (token) {
      const decodedToken: any = jwt_decode(token);

      console.log(decodedToken);
      this.paymentData.id = decodedToken?.UserId;

      this.receptionistService.createPayment(this.paymentData)
      .subscribe(
        response => {
          console.log('Success:', response);
          this.paymentData.memberName = '';
          this.paymentData.date = '';
          this.errMessage = '';
          this.getAllPayments();
        },
        error => {
          console.error('Error:', error);
          // Handle error
        });
      }
    }

  loadMembersNames(): void {
    this.receptionistService.getMembersNames()
      .subscribe(response => {
        this.membersNames = response;
        console.log(this.membersNames);
      });
  }

  resetForm(): void {
    this.paymentData.memberName = '';
    this.paymentData.date = '';
  }


  getAllPayments(): void {
    this.receptionistService.getAllPayments()
      .subscribe(payments => this.payments = payments);
  }


}
