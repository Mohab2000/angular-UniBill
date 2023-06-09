import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Bills } from 'src/app/models/Bills';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BillDataService {
  searchString: string;
  userId;
  billsUrl =
    'https://firestore.googleapis.com/v1/projects/unibell-5f28c/databases/(default)/documents/Users';
  path = '/Bills';
  electricityAmountPrice: string = '2';
  electricityOverdue: string = '200';
  waterAmountPrice: string = '5';
  waterOverdue: string = '100';
  telephoneAmountPrice: string = '7';
  telephoneOverdue: string = '300';
  billsRef: AngularFirestoreCollection<Bills>;
  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private auth: AuthService
  ) {
    this.billsRef = afs.collection(this.path);
    this.auth.getCurrentUser().subscribe((user) => {
      this.userId = user.uid;
    });

  }
  updateBill(bill: Bills): Observable<void> {
    const url = `${this.billsUrl}/${this.userId}/Bills/${bill.id}?updateMask.fieldPaths=status`;
    const data = {
      fields: {
        status: { stringValue: 'paid' },
      },
    };

    return this.http.patch<void>(url, data);
  }

  getBills(id: string) {
    return this.http.get<any>(`${this.billsUrl}/${id}/Bills`);
  }
  getBillById(id: string) {
    return this.http.get<any>(`${this.billsUrl}/${this.userId}/Bills/${id}`);
  }
  addBill(bill) {
    return this.http.post<any>(`${this.billsUrl}/${this.userId}/Bills`, bill)
  }
  searchBills(option: string) {
    return this.afs
      .collection(this.path, (ref) =>
        ref.where(option, '==', this.searchString)
      )
      .valueChanges();
  }
  searchByStatus() {
    return this.afs
      .collection(this.path, (ref) =>
        ref.where('status', '==', this.searchString)
      )
      .valueChanges();
  }



}
