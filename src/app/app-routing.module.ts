import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { PaymentComponent } from './payment/payment.component';
import { Page404Component } from './page404/page404.component';
import { ResultComponent } from './result/result.component';
import { ProfileComponent } from './profile/profile.component';
import { FormSubmitComponent } from './form-submit/form-submit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/:routeData',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register/:routeData',
    component: RegisterComponent
  },
  {
    path: 'forgetpassword',
    component: ForgetpasswordComponent
  },
  {
    path: 'forgetpassword/:routeData',
    component: ForgetpasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/:routeData',
    component: HomeComponent
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'quiz/:routeData',
    component: QuizComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: 'result/:routeData',
    component: ResultComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'payment/:routeData',
    component: PaymentComponent
  },
  {
    path: 'formsubmit',
    component: FormSubmitComponent
  },
  {
    path: 'formsubmit/:routeData',
    component: FormSubmitComponent
  },
  {
    path: '**',
    component: Page404Component
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
