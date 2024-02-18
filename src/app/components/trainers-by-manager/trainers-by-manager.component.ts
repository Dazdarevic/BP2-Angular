import { Component, OnInit, NgZone  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin/admin.service';
import jwt_decode from 'jwt-decode';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { ToastrService } from 'ngx-toastr';
import { TrainerSalaryDto } from 'src/app/interfaces/trainerSalaryDto.model';

@Component({
  selector: 'app-trainers-by-manager',
  templateUrl: './trainers-by-manager.component.html',
  styleUrls: ['./trainers-by-manager.component.css']
})
export class TrainersByManagerComponent {
  trainers: any[] = [];
  pom: any;
  salaryAmount!: number;

  constructor(
    private managerService: ManagerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchTrainers();
    // this.managerService.getTrainers().subscribe(
    //   (trainers) => {
    //     this.trainers = trainers;
    //     console.log(trainers, "treneri");
    //   },
    //   (error) => {
    //     console.error('Error fetching trainers:', error);
    //   }
    // );
  }

  fetchTrainers(): void {
    // if (this.pom && this.pom.id) {
    //   const userId = this.pom.id;
    //   console.log('User ID:', userId);
    // } else {
    //   console.log('User ID not found in token.');
    // }


    this.managerService.getAllTrainers().subscribe(
      (data) => {
        this.trainers = data;
        console.log("treneri", data);
        this.trainers.forEach((trainer) => {
          this.managerService.getTrainerOccurrence(trainer.id).subscribe(
            (occurrenceCount) => {
              trainer.occurrenceCount = occurrenceCount;
            },
            (error) => {
              console.error('Error fetching occurrence count:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching trainers:', error);
      }
    );
  }

  toggleInput(trainer: TrainerSalaryDto): void {
    trainer.showInput = true;
    trainer.showPriceInput = !trainer.showPriceInput;
    trainer.membershipPrice = ''; // Resetuj vrednost input polja
  }

  cancelInput(trainer: TrainerSalaryDto): void {
    trainer.showPriceInput = !trainer.showPriceInput;
    trainer.showInput = false;
  }


  submitMembershipPrice(trainer: TrainerSalaryDto): void {
    const trainerId = trainer.id;
    console.log(trainer.occurrenceCount + "dal ovoo radiiiiiii, AMAN???????");
    if (trainer.occurrenceCount > 0)
    {
      this.salaryAmount = trainer.anotherInput * trainer.occurrenceCount;
    }
    else
    {
      this.salaryAmount = trainer.anotherInput;
    }

    // Proveri da li je salaryAmount validan broj
    if (!isNaN(this.salaryAmount) && isFinite(this.salaryAmount)) {
      console.log("Radi", this.salaryAmount);
      this.managerService.addTrainerSalary(trainerId, this.salaryAmount).subscribe(
        (response) => {
          // Ažuriraj vrednost salaryAmount za odgovarajućeg trenera
          trainer.salaryAmount = this.salaryAmount.toString();

          console.log('Salary added successfully:', response);
        },
        (error) => {
          console.error('Error adding salary:', error);

          if (error.error instanceof ErrorEvent) {
            // Greška na klijentskoj strani
            console.error('Client-side error:', error.error.message);
          } else {
            // Greška na serverskoj strani
            console.error('Server-side error:', error.status, error.statusText, error.error);
          }
        }
      );

      trainer.showInput = false;
      trainer.showPriceInput = !trainer.showPriceInput;
    } else {
      console.error('Invalid salaryAmount:', this.salaryAmount);
    }
  }
}
