
  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { PaymentByRecDto } from 'src/app/interfaces/paymentByRecDto.model';
import { SendEmailDto } from 'src/app/interfaces/sendEmailDto.model';
import { PaymentDto } from 'src/app/interfaces/paymentDto.model';

  @Injectable({
    providedIn: 'root'
  })
export class ReceptionistService {

    public baseUrl = environment.baseUrl + '/Receptionist';

    constructor(private http: HttpClient) { }

    sendEmail(emailModel: SendEmailDto): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const url = `${this.baseUrl}/send-email`;
      return this.http.post(url, emailModel);
    }

    getAllRequests(): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const url = `${this.baseUrl}/get-all-requests`;
      return this.http.get(url, { headers });
    }
    getMembersNames(): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const url = `${this.baseUrl}/get-all-members-names`;
      return this.http.get(url, { headers });
    }

    createPayment(payment: PaymentByRecDto): Observable<any> {
      return this.http.post<PaymentByRecDto>(`${this.baseUrl}/create-payment`, payment);
    }
    approveRegistrationRequest(requestId: number): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      const url = `${this.baseUrl}/approve-registration-request/${requestId}`;
      return this.http.post(url, {headers});
    }

    deleteRequest(requestId: number): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      const url = `${this.baseUrl}/delete-request/${requestId}`;
      return this.http.delete(url, { headers });
    }

    getAllPayments(): Observable<PaymentDto[]> {
      return this.http.get<PaymentDto[]>(`${this.baseUrl}/all-payments`);
    }
}
