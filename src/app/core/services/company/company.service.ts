import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { IJobOffer } from '../../../features/jobs/jobs-wrap/jobs-wrap.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private firestore: Firestore) {}

  getCompanyData(companyId: string): Observable<IJobOffer[]> {
    const jobOffersCollection = collection(this.firestore, 'jobs');
    const jobOfferQuery = query(jobOffersCollection, where('companyId', '==', companyId));

    return from(getDocs(jobOfferQuery)).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              }) as IJobOffer
          );
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching job offers:', error);
        return of([]);
      })
    );
  }

  deleteJobOffer(jobOfferId: string): Observable<void> {
    const jobOfferDoc = doc(this.firestore, 'jobs', jobOfferId);

    return from(deleteDoc(jobOfferDoc)).pipe(
      catchError((error) => {
        console.error('Error deleting job offer:', error);
        return throwError(() => new Error('Failed to delete job offer'));
      })
    );
  }
}
