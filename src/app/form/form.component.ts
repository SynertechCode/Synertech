import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  username: string = '';
  email: string = '';
  phone: string = ''; // Added phone number property
  date: string = ''; // Added date property
  project: string = '';

  @Input() isOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  toggleForm() {
    this.isOpen = !this.isOpen;
    this.toggle.emit();
  }

  registerUser(event: Event): void {
    event.preventDefault();

    if (!this.username || !this.email || !this.phone || !this.date || !this.project) {
      return;
    }

    const postData = {
      name: this.username,
      email: this.email,
      phone: this.phone,
      date: this.date,
      project: this.project
    };

    console.log('Data being sent to the server:', postData);

    this.http.post<{ message: string }>("https://synertech-back.onrender.com", postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .pipe(
      switchMap((response: any) => {
        return of(response);
      })
    ).subscribe(
      {
        next: (response: any) => {
          console.log('Server response:', response);
          alert('You have successfully registered!');
          this.resetForm();
        },
        error: error => {
          console.error('Error:', error);
          alert('An error occurred: ' + error.message);
        }
      }
    );
  }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.phone = ''; // Reset phone
    this.date = ''; // Reset date
    this.project = '';
  }
}
