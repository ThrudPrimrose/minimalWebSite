import { Routes } from '@angular/router';
import { GreetComponent } from './greet/greet.component';
import { CardListComponent } from './card-list/card-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/greet', pathMatch: 'full' },
    { path: 'greet', component: GreetComponent },
    { path: 'cards', component: CardListComponent },
];
