import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { collection, deleteDoc, doc, FirestoreDataConverter, getDocs, query, where } from 'firebase/firestore';
import { from, map } from 'rxjs';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { ContentModalComponent } from '../../../core/components/modals/content-modal/content-modal.component';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { IJobApplication } from '../../jobs/jobs-wrap/jobs-wrap.interface';
import { IApplicationCV } from './view-application.interface';

@Component({
  selector: 'swip-view-application',
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, LoaderComponent],
  templateUrl: './view-application.component.html',
})
export class ViewApplicationComponent extends ContentModalComponent {
  private destroyerRef = inject(DestroyRef);
  cvUrls: IApplicationCV[] = [];
  currentCVIndex = signal(0);
  isMobile = signal(false);
  loading = signal(false);

  constructor(
    private firestore: Firestore,
    private sanitizer: DomSanitizer,
    private mobileService: MobileService
  ) {
    super();
    this.loadApplication(this.data.id);
    this.setMobileSub();
  }

  private setMobileSub() {
    this.mobileService.isMobile$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((isMobile) => this.isMobile.set(isMobile));
  }

  private loadApplication(jobId: string) {
    this.loading.set(true);

    const jobApplicationConverter: FirestoreDataConverter<IJobApplication> = {
      toFirestore(app: IJobApplication) {
        return app;
      },
      fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return data as IJobApplication;
      },
    };

    const applicationsRef = collection(this.firestore, 'applications').withConverter(jobApplicationConverter);
    const filteredQuery = query(applicationsRef, where('jobId', '==', jobId), where('status', '==', 'applied'));

    from(getDocs(filteredQuery))
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            jobId: doc.data().jobId,
            name: doc.data().cv.name,
            data: this.convertToBlobUrl(doc.data().cv.value),
          }))
        )
      )
      .subscribe({
        next: (converted) => {
          this.cvUrls = converted;
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading applications:', err);
          this.loading.set(false);
        },
      });
  }

  deleteApplication(applicationId: string) {
    this.loading.set(true);
    const applicationDoc = doc(this.firestore, `applications/${applicationId}`);
    from(deleteDoc(applicationDoc))
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(() => {
        this.loading.set(false);
        this.dialogRef.close();
      });
  }

  private convertToBlobUrl(base64: string): SafeResourceUrl {
    try {
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      if (base64Data.length % 4 !== 0) {
        console.error('Invalid Base64 length:', base64Data);
        return '';
      }

      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([array], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustResourceUrl(`${url}#toolbar=0&navpanes=0&scrollbar=0`);
    } catch (error) {
      console.error('Base64 conversion error:', error);
      return '';
    }
  }

  nextCV() {
    this.currentCVIndex.set((this.currentCVIndex() + 1) % this.cvUrls.length);
  }

  prevCV() {
    this.currentCVIndex.set((this.currentCVIndex() - 1 + this.cvUrls.length) % this.cvUrls.length);
  }

  get isPrevDisabled() {
    return this.cvUrls.length <= 1 || this.currentCVIndex() === 0;
  }

  get isNextDisabled() {
    return this.cvUrls.length <= 1 || this.currentCVIndex() === this.cvUrls.length - 1;
  }
}
