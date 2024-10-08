import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    { path: '', component: MainComponent},
    { path: 'users', component: UsersComponent }
];
