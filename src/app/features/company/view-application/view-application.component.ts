import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { map } from 'rxjs';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { ContentModalComponent } from '../../../core/components/modals/content-modal/content-modal.component';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
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
    const applicationsCollection = collection(this.firestore, `jobs/${jobId}/applications`);
    collectionData(applicationsCollection, { idField: 'id' })
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        map((applications: any[]) =>
          applications.map((app) => {
            return { id: app.id, jobId: jobId, data: this.convertToBlobUrl(app.cv.value), name: app.cv.name };
          })
        )
      )
      .subscribe((urls) => {
        this.cvUrls = urls;
        this.loading.set(false);
      });
  }

  deleteApplication(applicationId: string, jobId: string) {
    const applicationDoc = doc(this.firestore, `jobs/${jobId}/applications/${applicationId}`);
    deleteDoc(applicationDoc);
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
