import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
  

  formValidation(){
    if(this.formData.pass == this.formData.cpass){
      if(this.formData.pass.length > 0 && this.formData.cpass.length>0){
        return true;
      }
    }
    
    return false;
  }


  async register(){
    this.loader(true);

    let validateForm = await this.formValidation();
    if(validateForm==false){
      this.AS.alert('password & confirm password mismatch');
      return;
    }

    let credential = {
    "username": this.formData['user'],
    "fullname": this.formData['name'],
    "password": this.formData['pass']
    }

    this.AS.register(credential).subscribe(res=>{

      console.log('Registering In:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
               alert('Registered successfully');
               //this.AS.alert('Registered successfully');
               //window.location.assign('/');
               this.login();
            }else{
               this.AS.alert('Registered failed, please try again');
            }
            
          }else{
            this.AS.alert('empty data');
          }

      this.loader();

    },(err)=>{
      this.AS.alert(err.error.message);
      console.log('Err:',err);
      this.loader();
    })


  }




}
