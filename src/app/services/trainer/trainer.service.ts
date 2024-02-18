import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { CommentDto } from 'src/app/interfaces/commentDto.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  public baseUrl = environment.baseUrl + '/Trainer';

  constructor(private http: HttpClient) { }

  getMembersWithSelectedTrainer(trainerId: number): Observable<any> {
    const url = `${this.baseUrl}/members-with-selected-trainer/${trainerId}`;
    return this.http.get(url);
  }

  getComment(trainerId: number, memberId: number): Observable<CommentDto> {
    return this.http.get<CommentDto>(`${this.baseUrl}/comments/${trainerId}/${memberId}`);
  }

  addComment(comment: CommentDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-comment`, comment);
  }

}
