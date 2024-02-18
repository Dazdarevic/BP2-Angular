
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MemberService
} from 'src/app/services/member/member.service';
import jwt_decode from 'jwt-decode';
import { NgZone } from '@angular/core';
import { SieveModel } from 'src/app/models/sieve-model';
import { Trainer } from 'src/app/interfaces/trainer.model';
import { PaginatedTrainers } from 'src/app/interfaces/paginatedTrainers.model';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-show-trainers',
  templateUrl: './show-trainers.component.html',
  styleUrls: ['./show-trainers.component.css']
})
export class ShowTrainersComponent implements OnInit {
  paginatedTrainers!: PaginatedTrainers;
  trainers: any[] = [];
  filterText: string = '';


  treneri!: any[];
  idKorisnik!: number;

  searchQuery!: string;
  filteredPacijenti!: any[];
  selectedSortBy: string = 'default';

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 2;

  data: any[] = [];
  page: number = 1;
  count: number = 0;
  totalLength: any;

  tableSize: number = 1;
  tableSizes: any = [3, 6, 9, 12];

  selectedTrainerStatus: Boolean = true;
  trainer: any;
  selectedTrainerId!: any;
  rating: number = 0;
  hoverRating: number=0;
  btnSaveRating: Boolean = true;
  memberId: any;
  member: any;
  averageRate: any;
  averageRatings: number[] = []; // Niz za prosečne ocene
  rate: any;
  searchTerm: string = '';
  sortField: string = 'firstName';
  sieveModel: SieveModel = new SieveModel();
  // currentPage = 1;
  // pageSize = 1;
  totalItems: number = 0;
  p!: number;
  filter: string = "primer";


  constructor(private memberService: MemberService,
    private zone: NgZone) { }

  ngOnInit(): void {
    this.checkIsSelectedTrainer();
    this.fetchId();
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.memberService.getPaginatedTrainersAsync(this.currentPage, this.pageSize)
      .subscribe(data => {
        this.trainers = data.value.trainers;
        this.totalPages = data.value.totalPages;
        this.currentPage = data.value.currentPage;
        console.log("Podaci", data.value);
      }
    );
  }


  rateStar(star: number) {
    this.rating = star;
  }
  onStarHover(star: number) {
    this.hoverRating = star;
  }

  onStarLeave() {
    this.hoverRating = 0;
  }

  applyFilters() {
    this.memberService.getFilteredTrainer(this.currentPage, this.pageSize, this.filterText)
      .subscribe(data => {
        this.trainers = data.value.trainers;
        this.totalPages = data.value.totalPages;
        this.currentPage = data.value.currentPage;
        console.log("Podatak", data.value.trainers);
      });
  }

  sortTrainers(): void {
    this.memberService.sortPagTrainers(this.currentPage, this.pageSize, this.sortField)
    .subscribe(data => {
      this.trainers = data.value.trainers;
      this.totalPages = data.value.totalPages;
      this.currentPage = data.value.currentPage;
      console.log("Podatak", data.value.trainers);
    });
  }

  fetchTrainers(): void {

    this.memberService.getAllTrainers().subscribe(
      (data) => {
        this.trainers = data;


        for (let i = 0; i < this.trainers.length; i++) {
          console.log(data[i].id);
          this.getAverageRating(data[i].id);
          console.log("Average Rating", this.getAverageRating(data[i].id));
        }

      },
      (error) => {
        // console.error('Error fetching:', error);
      }
    );
  }

  getAverageRating(trainerId: number) {
    this.memberService.averageRatingForTrainer(trainerId).subscribe(
      (result) => {
        console.log("REZULTAT", result);
        this.rate = result; // Ažuriranje niza sa dobijenom prosečnom ocenom
        // this.averageRatings.push(result);
        this.averageRatings[trainerId] = result;
      },
      (error) => {
        console.error('Greška prilikom dobijanja prosečne ocene za trenera:', error);
      }
    );
  }

  checkRatingForTrainer(trainerId: number) {
    const token = localStorage.getItem('token');
      if (token) {
          this.member = jwt_decode(token);
          this.memberId = this.member.UserId;
            // console.log("MEMBER ID", this.memberId);
      }

    this.memberService.checkRating(this.memberId, trainerId).subscribe(
      response => {
        // console.log("Odgovor", response.message);
        if (response.message == "Rating exists.") {
          this.btnSaveRating = false;
        }
        else {
          this.btnSaveRating = true;
        }
      },
      error => {
        // console.log("Javila se neka greska, ne panici", error);
      }
    );
  }

  async fetchId(): Promise<void> {
    const token = localStorage.getItem('token');
          if (token) {
            this.member = jwt_decode(token);
            this.memberId = this.member.UserId;
            // console.log("MEMBER ID", this.memberId);
          }
    try {
      const memberData = await this.memberService.getMember(this.memberId).toPromise();
      this.trainer = memberData;
      this.selectedTrainerId = memberData.selectedTrainerId;
      this.checkRatingForTrainer(this.selectedTrainerId);

      // console.log("RADIIIIII", this.selectedTrainerId);
      // this.checkRatingForTrainer(this.selectedTrainerId);

      // console.log(this.trainer.selectedTrainerId);
      if (this.selectedTrainerId) {
        const trainerData = await this.memberService.getTrainer(this.selectedTrainerId).toPromise();
        this.trainer = trainerData;
        // console.log("Trainer", trainerData);
      }

      // console.log("Id trenera", this.selectedTrainerId);
    } catch (error) {
      // console.error('Greška prilikom dobijanja podataka', error);
    }
  }


  checkIsSelectedTrainer(): void {
    const token = localStorage.getItem('token');
          if (token) {
            this.member = jwt_decode(token);
            this.memberId = this.member.UserId;
            // console.log("MEMBER ID", this.memberId);
          }
    this.memberService.checkSelectedTrainer(this.memberId).subscribe(
      (response: any) => {
        if (response === "Member has selected a trainer.") {
          this.selectedTrainerStatus = true;
        }
        else {
          this.selectedTrainerStatus = false;
        }
        // console.log("Rezultat za status ", response);
      },
      (error) => {
        this.selectedTrainerStatus = false;
        // console.error('Error checking selected trainer:', error);
      }
    );


  }



  sendRating(trainerId: number) {
    const token = localStorage.getItem('token');
          if (token) {
            this.member = jwt_decode(token);
            this.memberId = this.member.UserId;
            // console.log("MEMBER ID", this.memberId);
          }
    if (this.rating > 0) {
      const memId = this.memberId;
      const ratingValue = 3;
      // console.log("Ocena  ", this.rating);

      this.memberService.rateTrainer(memId, trainerId, ratingValue).subscribe(
        response => {
          // console.log('Trainer rated successfully.');
          this.btnSaveRating = false;
        },
        error => {
          // console.error('Rating failed.', error);
        }
      );
    }
  }

  chooseTrainer(id: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.member = jwt_decode(token);
      this.memberId = this.member.UserId;
      // console.log("MEMBER ID", this.memberId);
    }
    this.memberService.chooseTrainer(this.memberId, id).subscribe(
      response => {
        // console.log(response);
        this.checkIsSelectedTrainer();
        this.fetchTrainers();
        this.fetchId();
        // window.location.reload();
        this.checkRatingForTrainer(id);
      },
      error => {
        // console.log("Greska prilikom biranja trenera");
      }
    );
  }

  uncheckTrainer() {
    const token = localStorage.getItem('token');
          if (token) {
            this.member = jwt_decode(token);
            this.memberId = this.member.UserId;
            // console.log("MEMBER ID", this.memberId);
          }
    this.memberService.resetSelectedTrainerId(this.memberId).subscribe(
      response => {
        // console.log("Odgovor", response);
        this.checkIsSelectedTrainer();
        this.fetchTrainers();
        this.fetchId();
      },
      error => {
        // console.log("Greska prilikom resetovanja trenera", error);
      }
    );
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTrainers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTrainers();
    }
  }
}
