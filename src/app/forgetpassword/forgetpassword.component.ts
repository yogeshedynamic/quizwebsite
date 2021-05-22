import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {

  formData:any = {};
  routeParams:any;
  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router) { 

  }
  ngOnInit(): void {
    this.initCheckAlreadyLoggedIn();
    this.getRouteParams();
  }

  loader(par = false){
    if(par){
      this.AS.screenLoader('show');
    }else{
      this.AS.screenLoader('hide');
    }
  }

  initCheckAlreadyLoggedIn(){ 
      this.loader(true);

      this.AS.isLoggedIn().then(res=>{
        
        // if(res){
        //   console.log('Auto Login check: You have already logged in');
        // }

        if(res){

          
          this.router.navigate(['/login']);
        }else{
          //this.router.navigate(['/login']);
        }

        this.loader();
        
      }, err=>{
        //this.router.navigate(['/login']);
        this.loader();
      });
  }

  getRouteParams(){
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    // });
    this.route.params.subscribe( params => {
      if(!!params['routeData']){
        let paramData;
        if(params['routeData'].constructor.toString().indexOf('String') != -1){
          paramData = params['routeData'];
        }else{
          paramData = JSON.parse(params['routeData']);
        }
        console.log('route params',paramData);
        if(Object.keys(paramData).length > 0){
          this.routeParams = paramData;

          //setTimeout(()=> this.getTestList(),200);
        }
      }
      
      
    });
  }

  async login(){
    let resultPayload = await this.AS.commandinDB('get',this.routeParams);
    if(resultPayload != null && this.routeParams != undefined){
      this.router.navigate(['login', this.routeParams]);
    }else{
      this.router.navigate(['login']);
    }
  }
  
  async forgetPassword(){
    this.loader(true);

    let credential = {'username': this.formData['user']};
    this.formData['user'] = '';
    
    this.AS.forgetPassword(credential).subscribe(res=>{

      console.log('forget Password:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
             
              alert('Otp sent successfully for forget password');
              let optMatch = prompt('otp');
              if(optMatch == res['data']['otp']){
                alert('sent a new password');
              }else{
                alert('OTP incorrect');
              }
              
                
            }else{
               this.AS.alert('username incorrect');
            }
            
          }else{
            this.AS.alert('empty data');
          }

      this.loader();

    },(err)=>{
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })


     

  }









}
