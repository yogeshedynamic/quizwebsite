import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
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

import { AuthserviceService } from './authservice.service';
import { AuthGuardService } from './auth-guard.service';
import { ApiInterceptorServiceInterceptor } from './api-interceptor-service.interceptor';



import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  FacebookLoginProvider, GoogleLoginProvider,AmazonLoginProvider,VKLoginProvider,MicrosoftLoginProvider
} from 'angularx-social-login';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent,
    HomeComponent,
    QuizComponent,
    PaymentComponent,
    Page404Component,
    ResultComponent,
    ProfileComponent,
    FormSubmitComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule
  ],
  providers: [
    AuthserviceService,
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorServiceInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              //'624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com'
              '174704349583-sir7sl01puljmlt8gauslhjrnrvlgd8m.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              //'561602290896109'
              '699701464036260'
            ),
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              'amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935'
            ),
          },
          {
            id: VKLoginProvider.PROVIDER_ID,
            provider: new VKLoginProvider(
              '7624815'
            ),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider('0611ccc3-9521-45b6-b432-039852002705'),
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
