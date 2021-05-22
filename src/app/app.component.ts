import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthserviceService } from './authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Quiz test';



  socialUser: any;
  loggedIn: boolean;
  menu = [];
  menuDikshaKiran = [];
  constructor(private AS:AuthserviceService, private router:Router,private cdRef:ChangeDetectorRef) { 
    
  }

  ngOnInit() {
    
    this.getUserDetails();

    if(window.location.hostname != "testwebsite.codepiercer.in" && window.location.hostname != "localhost"){
      console.log = function(){}
    }

    this.AS.getLiveBroadCastData().subscribe(x=>{
      if(x=='loginSuccess'){
        this.getUserDetails('update');
      }
    });
  }

  async getUserDetails(x=null){
    this.socialUser = await this.AS.userCTRL('get');
    this.menuGenerator();
    this.menuGeneratorForDishaKiran();

    console.log('loggedIn',this.socialUser);

    if(x=='update'){
      this.cdRef.detectChanges();
    }
  }

 

  loggedInVia(param = null,refresh = false){
    
    this.AS.loggedInViaCTRL(param,refresh);
    
  }

  logOut(){
    this.AS.loggedOut();
    this.loggedInVia();
    this.AS.alert('Logged Out');
    this.router.navigate(['/login']);
    window.location.assign('/');
  }


  menuGenerator(){

    if(this.socialUser != null){
      this.menu = [
        {
          'name': 'profile',
          'navLink': '/profile'
        }
      ]
    }else{
      this.menu = [
         
        {
          'name': 'Login / Register',
          'navLink': '/login'
        }
      ]
    }

    
    // this.menu = [
    //   {
    //     'name': 'Home',
    //     'navLink': '/home'
    //   },
    //   {
    //     'name': 'Login',
    //     'navLink': '/login'
    //   },
    //   {
    //     'name': 'Register',
    //     'navLink': '/register'
    //   },
    //   {
    //     'name': 'Forgetpassword',
    //     'navLink': '/forgetpassword'
    //   },
    //   {
    //     'name': 'Quiz',
    //     'navLink': '/quiz'
    //   },
    //   {
    //     'name': 'Result',
    //     'navLink': '/result'
    //   },
    //   {
    //     'name': 'Payment',
    //     'navLink': '/payment'
    //   },
    //   {
    //     'name': 'profile',
    //     'navLink': '/profile'
    //   },
    //   {
    //     'name': '404',
    //     'navLink': '/page404'
    //   }
    // ]

    console.log(this.menu);
  }

  menuGeneratorForDishaKiran(){

     
      this.menuDikshaKiran = [
        {
          'name': 'Home',
          'target': '_blank',
          'navLink': 'https://dishakiran.com/'
        },
        {
          'name': 'Products',
          'target': '_blank',
          'navLink': 'https://dishakiran.com/products/'
        },
        {
        'name': 'About Us',
        'target': '_blank',
        'navLink': 'https://dishakiran.com/about-us/'
        },
        {
        'name': 'Blog',
        'target': '_blank',
        'navLink': 'https://dishakiran.com/blog/'
        },
        {
        'name': 'Contact Us',
        'target': '_blank',
        'navLink': 'https://dishakiran.com/contact-us/'
        }
      ]

    
}

  






}
