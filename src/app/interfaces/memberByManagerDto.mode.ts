import { map } from 'rxjs';
export interface MemberDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  trainerFirstName: string;
  trainerLastName: string;
  membershipId: number;
  membershipAmount: string;
  showPriceInput: boolean;
  showInput: boolean;
  anotherInput: number;
}
