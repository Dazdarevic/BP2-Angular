import { Component } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { MemberDto } from 'src/app/interfaces/memberByManagerDto.mode';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  members: MemberDto[] = [];
  membershipAmount!: number;

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    this.fetchMembers();
    // this.addMembership();
  }

  fetchMembers(): void {
    this.managerService.getAllMembersByManager().subscribe(
      (data) => {
        this.members = data;
      },
      (error) => {
        console.error('Error fetching members:', error);
      }
    );
  }

  toggleInput(trainer: any): void {
    trainer.showInput = true;
    trainer.showPriceInput = !trainer.showPriceInput;
   trainer.membershipPrice = ''; // Resetuj vrednost input polja
 }

   cancelInput(trainer: any): void {
   trainer.showPriceInput = !trainer.showPriceInput;
   trainer.showInput = false;
 }

 submitMembershipPrice(user: MemberDto): void {
   const userId = user.id;
   this.membershipAmount = user.anotherInput;

   console.log("Radi", this.membershipAmount);

   this.managerService.addMembership(userId, this.membershipAmount).subscribe(
     (response) => {
      user.membershipAmount = this.membershipAmount.toString();
       console.log('Membership added successfully:', response);
     },
     (error) => {
       console.error('Error adding Membership:', error);

       if (error.error instanceof ErrorEvent) {
         // Greška na klijentskoj strani
         console.error('Client-side error:', error.error.message);
       } else {
         // Greška na serverskoj strani
        console.error('Server-side error:', error.status, error.statusText, error.error);
       }
     }
   );

   user.showInput = false;
   user.showPriceInput = !user.showPriceInput;
 }


//  addMembership(): void {
//   this.managerService.addMembership(1, "50")
//     .subscribe(
//       response => {
//         console.log('Membership added successfully!', response);
//       },
//       error => {
//         console.error('Error adding membership:', error);
//       }
//     );
// }
}
