import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, switchMap } from 'rxjs';
import 'flatpickr/dist/flatpickr.min.css'; // Імпорт стилів
import flatpickr from 'flatpickr';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [NotifierService],
})
export class FormComponent implements AfterViewInit {
  username: string = '';
  email: string = '';
  phone: string = ''; // Added phone number property
  date: string = ''; // Added date property
  project: string = '';

  private readonly notifier: NotifierService;

  ngAfterViewInit() {
    flatpickr("#datetime", {
      disableMobile: true, // Change from "true" to true (boolean)
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
    });
  }

  @Input() isOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private notifierService: NotifierService) {
    this.notifier = notifierService;
  }  

  toggleForm() {
    this.isOpen = !this.isOpen;
    this.toggle.emit();
  }

  registerUser(event: Event): void {
    event.preventDefault();

    if (!this.username || !this.email || !this.phone || !this.date) {
      return;
    }

    const postData = {
      name: this.username,
      email: this.email,
      phone: this.phone,
      date: this.date,
      project: this.project || 'N/A'
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
          this.notifier.notify('success', 'You have successfully registered!');

          this.resetForm();
        },
        error: error => {
          console.error('Error:', error);
          this.notifier.notify('error', 'An error occurred: ' + error.message);
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
