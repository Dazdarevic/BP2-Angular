import jwt_decode from 'jwt-decode';
import { Component } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer/trainer.service';
import { MemberByTrainerDto } from '../../interfaces/memberByTrainerDto.model';
import { CommentDto } from '../../interfaces/commentDto.model';

@Component({
  selector: 'members-by-trainer',
  templateUrl: 'members-by-trainer.component.html',
  styleUrls: ['./members-by-trainer.component.css']

})
export class MembersByTrainerComponent {
  members: MemberByTrainerDto[] = [];
  trainerId: number = 0;
  trainer: any;
  comment!: CommentDto;
  commentText: string = '';

  constructor(private trainerService: TrainerService) { }

  ngOnInit(): void {
    this.loadMembers();
    this.getComment(1, 1);

  }

  loadMembers(): void {
    const token = localStorage.getItem('token');
      if (token) {
          this.trainer = jwt_decode(token);
          this.trainerId = this.trainer.UserId;
            // console.log("MEMBER ID", this.memberId);
    this.trainerService.getMembersWithSelectedTrainer(this.trainerId)
      .subscribe(
        (response) => {
          this.members = response;
          console.log('Members with selected trainer:', response);
          this.loadCommentsForMembers();
        },
        (error) => {
          console.error('Error loading members:', error);
        }
        );
      }
  }
  loadCommentsForMembers(): void {
    // Iterirajte kroz svakog člana i pozovite metodu za dobijanje komentara
    for (let member of this.members) {
      this.trainerService.getComment(this.trainerId, member.id)
        .subscribe(
          (response) => {
            member.comment = response.text;
            member.commentId = response.id;
            console.log('Comment for member:', member.firstName, response.text, response.id);
          },
          (error) => {
            console.error('Error loading comment for member:', member.firstName, error);
          }
        );
    }
  }
  getComment(trainerId: number, memberId: number): void {
    this.trainerService.getComment(trainerId, memberId)
      .subscribe(
        (response) => {
          this.comment = response;
          console.log('Comments:', response);
        },
        (error) => {
          console.error('Error loading comments:', error);
        }
        );
  }


  toggleInput(member: any): void {
    member.showInput = true;
    member.showPriceInput = !member.showPriceInput;
    member.membershipPrice = ''; // Resetuj vrednost input polja
 }

   cancelInput(member: any): void {
    member.showPriceInput = !member.showPriceInput;
    member.showInput = false;
  }

  submitComment(user: MemberByTrainerDto): void {
    const userId = user.id;
    const commentId = user.commentId;
    this.commentText = user.anotherInput.toString();

    user.comment = this.commentText.toString();

    const commentData: CommentDto = {
      id: commentId,
      trainerId: this.trainerId,
      memberId: userId,
      text: this.commentText
    };

    this.trainerService.addComment(commentData)
        .subscribe(
          (response) => {
            console.log('Comment added successfully:', response);
          },
          (error) => {
            console.error('failed:', error);
          }
    );

    user.showInput = false;
    user.showPriceInput = !user.showPriceInput;
  }
}
