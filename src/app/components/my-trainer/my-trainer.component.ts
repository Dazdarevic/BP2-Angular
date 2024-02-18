import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CommentDto } from 'src/app/interfaces/commentDto.model';
import jwt_decode from 'jwt-decode';
import { PaymentDto } from 'src/app/interfaces/paymentDto.model';

@Component({
  selector: 'my-trainer',
  templateUrl: './my-trainer.component.html',
  styleUrls: ['./my-trainer.component.css']
})
export class MyTrainerComponent implements OnInit{
  comment: any | undefined;
  payments: PaymentDto[]=[];

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);

      //console.log(decodedToken);
      // this.userId = decodedToken?.UserId;

      this.getComment(decodedToken?.UserId);

    }

    this.getPaymentsForMember();
  }


  getComment(memberId: number): void {

    this.memberService.getComment(memberId)
      .subscribe(
        (response) => {
          this.comment = response.text.toString();
          console.log('Comment:', response);
        },
        (error) => {
          console.error('Error loading comment:', error);
        }
      );
  }

  getPaymentsForMember(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);
      console.log("UserName", decodedToken);


    this.memberService.getPaymentsForMember(decodedToken?.UserName)
      .subscribe((response) => {
        this.payments = response;
        console.log('Payment:', response);
      },
        (error) => {
          console.error('Error loading comment:', error);
        });
    }
  }
}
