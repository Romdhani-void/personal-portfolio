import { Routes } from '@angular/router';

import { SplashComponent } from './pages/splash/splash.component';
import { HomeComponent } from './pages/home/home.component';
import { WorkComponent } from './pages/work/work.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'home', component: HomeComponent },
  { path: 'work', component: WorkComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  
];
