import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { UserInfoDto } from 'src/app/interfaces/userInfoDto.model';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  public baseUrl = environment.baseUrl + '/User';

  constructor(private http: HttpClient) { }


  getUserByIdAndRole(userId: number, role: string): Observable<UserInfoDto> {
    const url = `${this.baseUrl}/${userId}?role=${role}`;
    return this.http.get<UserInfoDto>(url);
  }

  updateProfilePicture(userId: number, role: string, profilePictureUrl: any): Observable<any> {
    const command = {
      userId: userId,
      role: role,
      profilePictureUrl: profilePictureUrl
    };

    return this.http.post<any>(`${this.baseUrl}/update-profile-picture`, command);
  }
}
