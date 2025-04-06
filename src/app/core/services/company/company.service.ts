import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  where,
} from 'firebase/firestore';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import {
  EDirection,
  ICompanyOffers,
  IJobOffer,
  IJobOfferDTO,
} from '../../../features/jobs/jobs-wrap/jobs-wrap.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  lastVisibleDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null;
  historyStack: QueryDocumentSnapshot<DocumentData>[] = [];

  constructor(private firestore: Firestore) {}

  getCompanyData(
    companyId: string,
    currentPage: number,
    pageSize: number,
    direction?: EDirection
  ): Observable<ICompanyOffers> {
    const jobOffersCollection = collection(this.firestore, 'jobs');

    if (!direction || currentPage === 0) {
      this.lastVisibleDoc = null;
      this.historyStack = [];
    }

    let jobOfferQuery = query(
      jobOffersCollection,
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (direction === EDirection.RIGHT && this.lastVisibleDoc) {
      jobOfferQuery = query(
        jobOffersCollection,
        where('companyId', '==', companyId),
        orderBy('createdAt', 'desc'),
        startAfter(this.lastVisibleDoc),
        limit(pageSize)
      );
    } else if (direction === EDirection.LEFT && this.historyStack.length > 0) {
      this.historyStack.pop();
      const prevDoc = this.historyStack[this.historyStack.length - 1] || null;
      if (prevDoc) {
        jobOfferQuery = query(
          jobOffersCollection,
          where('companyId', '==', companyId),
          orderBy('createdAt', 'desc'),
          startAfter(prevDoc),
          limit(pageSize)
        );
      }
    }

    return from(getDocs(jobOfferQuery)).pipe(
      switchMap((querySnapshot) => {
        if (!querySnapshot.empty) {
          const offers = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as IJobOffer);

          if (direction === EDirection.RIGHT && this.lastVisibleDoc) {
            this.historyStack.push(this.lastVisibleDoc);
          }
          this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

          return this.getTotalJobOffersCount(companyId).pipe(
            map((totalCount) => ({
              offers,
              totalCount,
            }))
          );
        }
        return of({ offers: [], totalCount: 0 });
      }),
      catchError((error) => {
        console.error('Error fetching job offers:', error);
        return of({ offers: [], totalCount: 0 });
      })
    );
  }

  private getTotalJobOffersCount(companyId: string): Observable<number> {
    const jobOffersCollection = collection(this.firestore, 'jobs');
    const jobOfferQuery = query(jobOffersCollection, where('companyId', '==', companyId));

    return from(getDocs(jobOfferQuery)).pipe(
      map((querySnapshot) => querySnapshot.size),
      catchError((error) => {
        console.error('Error fetching total job offers count:', error);
        return of(0);
      })
    );
  }

  addJobOffer(data: IJobOffer): Observable<DocumentReference<DocumentData>> {
    const jobOffersCollection = collection(this.firestore, 'jobs');
    return from(addDoc(jobOffersCollection, { ...data, createdAt: serverTimestamp() } as IJobOfferDTO)).pipe(
      catchError((error) => {
        console.error('Error adding job offer:', error);
        return throwError(() => new Error('Failed to add job offer'));
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
