import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private visibilitySubject = new Subject<string>();

  visibility$ = this.visibilitySubject.asObservable();

  notifyVisibility(sectionId: string) {
    this.visibilitySubject.next(sectionId);
  }
}
