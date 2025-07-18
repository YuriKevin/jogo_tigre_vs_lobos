import { Routes } from '@angular/router';
import { Tabuleiro } from './components/tabuleiro/tabuleiro';
import { Home } from './components/home/home';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'play', component: Tabuleiro}
];
