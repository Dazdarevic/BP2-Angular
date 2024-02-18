import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  public baseUrl = environment.baseUrl + '/Manager';

  constructor(private http: HttpClient) { }

  getAllTrainers(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<any>(environment.baseUrl + '/Manager/trainers', { headers });
  }

  
  addTrainerSalary(trainerId: any, salaryAmount: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const body = {
      trainerId: trainerId,
      salaryAmount: salaryAmount
    };
    return this.http.post(`${this.baseUrl}/add-salary`, null, {
      headers,
      params: { trainerId, salaryAmount }
    });
  }

  addMembership(memberId: any, membershipAmount: any): Observable<any> {
    const body = { memberId, membershipAmount };
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(`${this.baseUrl}/add-membership`, null, {
      headers,
      params: { memberId, membershipAmount }
    });
  }

  getTrainerOccurrence(trainerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(`${this.baseUrl}/trainer-members/${trainerId}`, { headers });
  }

  getAllMembers(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<any>(environment.baseUrl + '/Trainer/members', { headers });
  }

  getAllMembersByManager(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<any>(environment.baseUrl + '/Trainer/all-members-by-manager', { headers });
  }
}
