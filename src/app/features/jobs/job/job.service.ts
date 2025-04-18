import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { catchError, EMPTY, from, map, Observable, of, Subject, switchMap } from 'rxjs';
import { IUser } from '../../../core/services/auth/auth.interface';
import {
  EApplicationStatus,
  ICompanyAdditionalData,
  IJobApplication,
  IJobOffer,
} from '../jobs-wrap/jobs-wrap.interface';

export const OFFERS_PER_REQUEST = 6;

@Injectable({
  providedIn: 'root',
})
export class JobService {
  needRefresh$ = new Subject<void>();

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  loadJobOffers(): Observable<IJobOffer[]> {
    return user(this.auth).pipe(
      switchMap((user) => this.getFilteredJobIds(user)),
      switchMap((filteredJobIds) => this.loadNextPage(filteredJobIds))
    );
  }

  loadCompanyInfo(companyId: string): Observable<ICompanyAdditionalData | null> {
    const companyRef = doc(this.firestore, `users/${companyId}/public/info`);

    return from(getDoc(companyRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            companyImage: data['companyImage'] || '',
            companyName: data['companyName'] || '',
          };
        }
        console.warn("Company doesn't exists", companyId);
        return null;
      }),
      catchError((error) => {
        console.error('Firestore error', error);
        return of(null);
      })
    );
  }

  private getFilteredJobIds(user: User | null): Observable<Set<string>> {
    if (!user) throw new Error('No user logged in');

    const applicationsRef = collection(this.firestore, `users/${user.uid}/applications`);
    return from(getDocs(applicationsRef)).pipe(
      map(
        (snapshot) =>
          new Set(
            snapshot.docs
              .map((doc) => ({ id: doc.id, status: doc.data()['status'] }))
              .filter((app) => app.status === 'applied' || app.status === 'rejected')
              .map((app) => app.id)
          )
      )
    );
  }

  private loadNextPage(excludedJobIds: Set<string>): Observable<IJobOffer[]> {
    const jobsRef = collection(this.firestore, 'jobs');
    const fetchLimit = OFFERS_PER_REQUEST * 2;
    const fetchOffers = (startAfterDoc: any = null, accumulated: IJobOffer[] = []): Observable<IJobOffer[]> => {
      const jobQuery = query(
        jobsRef,
        orderBy('title'),
        limit(fetchLimit),
        ...(startAfterDoc ? [startAfter(startAfterDoc)] : [])
      );

      return from(getDocs(jobQuery)).pipe(
        switchMap((snapshot) => {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
          const offers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IJobOffer);
          const filteredOffers = offers.filter((offer) => !excludedJobIds.has(offer.id));
          const newAccumulated = [...accumulated, ...filteredOffers];

          return newAccumulated.length >= OFFERS_PER_REQUEST || snapshot.docs.length < fetchLimit
            ? of(newAccumulated.slice(0, OFFERS_PER_REQUEST))
            : fetchOffers(lastDoc, newAccumulated);
        })
      );
    };

    return fetchOffers();
  }

  applyToJob(jobData: IJobOffer, status: EApplicationStatus) {
    const user = this.auth.currentUser;

    if (!user) {
      console.error('No user logged in');
      return of();
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const applicationsRef = collection(this.firestore, 'applications');

    return from(getDoc(userRef)).pipe(
      switchMap((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('User data not found');
        }

        const userData = snapshot.data() as IUser;

        if (userData.cv === null) {
          console.error('User CV not found');
          return EMPTY;
        }

        const applicationData: IJobApplication = {
          jobId: jobData.id,
          userId: user.uid,
          companyId: jobData.companyId,
          status: status,
          appliedAt: new Date().toISOString(),
          jobTitle: jobData.title,
          companyName: jobData.companyName,
          cv: userData.cv,
        };

        return from(addDoc(applicationsRef, applicationData));
      }),
      catchError((err) => {
        console.error('Error applying to job:', err);
        return of();
      })
    );
  }
}
