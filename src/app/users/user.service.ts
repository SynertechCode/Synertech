import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private registeredUsersSubject = new BehaviorSubject<any[]>([]); // Ініціалізація
  registeredUsers$ = this.registeredUsersSubject.asObservable(); // Створення Observable для підписки

  constructor() {}

  addUser(user: any) {
    const currentUsers = this.registeredUsersSubject.value; // Отримання поточного масиву користувачів
    this.registeredUsersSubject.next([...currentUsers, user]); // Додавання нового користувача
  }
}
