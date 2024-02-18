
import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { OnInit } from '@angular/core';
import { ReceptionistService } from 'src/app/services/receptionist/receptionist.service';
import { SendEmailDto } from 'src/app/interfaces/sendEmailDto.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  users: any[] = [];

  constructor(private receptionService: ReceptionistService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {

    this.receptionService.getAllRequests().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onDeleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.receptionService.deleteRequest(userId).subscribe(
        (response) => {
          console.log('User deleted:', response);
          this.fetchUsers();
          // Refresh users list or update UI as needed
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  onApproveUser(user: any) {
    this.receptionService.approveRegistrationRequest(user.id).subscribe(
      (response) => {
        console.log('User approved:', response);
        this.fetchUsers();
        const emailForUser: SendEmailDto = {
          email: user.email,
          subject: "Odobrena registracija",
          message: "Čestitamo"
        };

        this.receptionService.sendEmail(emailForUser).subscribe(
          (response) => {
            console.log("Email je uspesno poslat", response);
          }
        );
        // Refresh users list or update UI as needed
      },
      (error) => {
        console.error('Error approving user:', error);
      }
    );
  }
}
