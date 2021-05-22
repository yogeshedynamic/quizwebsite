import { Injectable } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate ,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 
import { Observable } from 'rxjs';
import { AuthserviceService } from './authservice.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate{

  constructor(private AS:AuthserviceService, private router:Router) { 
    
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean|Observable<boolean> {
      console.log("OnlyLoggedInUsers");
      
      // if (this.AS.isLoggedIn()) { 
      //   return true;
      // } else {
         
      //   this.router.navigate(['/login']);
      //   return false;
      // }

    return new Observable<boolean>( (observer) => {
        let result = false;

        this.AS.isLoggedIn().then(res=>{
          let result = res;
          // if(result==false){
          //   this.AS.alert('Unauthorised Access!');
          //   //this.navCtrl.navigateRoot('/login');
          // }

          if(result == undefined){
            result = false;
          }
          if(result == false){
            this.router.navigate(['/login']);
          }
          observer.next(result);
          observer.complete();
        })

        
    });
    
     
  }






}

