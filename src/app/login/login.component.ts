import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  routeParams:any;
  socialUser: any;
  loggedIn: boolean;
  
  
  formData:any = {};

  checkPayload:any = null;
  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router) { 

  }

  ngOnInit() {
    this.getSSloggedInDetails();
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

  getSSloggedInDetails(){
    this.AS.getSocialSharePlatformLoggedInDetails().subscribe((user) => {
      this.socialUser = user;
      //this.loggedIn = (user != null);

      console.log(this.socialUser);
      if(!!this.socialUser){
        this.socialLogin();
      }
      
    });
  }

  bhopuBajao(){
    let x = 'loginSuccess';
    this.AS.broadCastData(x);
  }

  loggedInVia(param = null,refresh = false){
    
    this.AS.loggedInViaCTRL(param,refresh);
    
  }

  initCheckAlreadyLoggedIn(){ 
      this.loader(true);

      this.AS.isLoggedIn().then(res=>{
        
        // if(res){
        //   console.log('Auto Login check: You have already logged in');
        // }

        if(res){
          this.router.navigate(['/']);
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


          this.checkPayload = this.AS.commandinDB('get',this.routeParams);
          //setTimeout(()=> this.getTestList(),200);
        }
      }
      
      
    });
  }

  async loginAsGuest(){
    
    let resultPayload = await this.AS.commandinDB('get',this.routeParams);
    if(resultPayload == null && this.routeParams != undefined){
      this.router.navigate(['quiz', this.routeParams]);
    }
  }

  async register(){
    let resultPayload = await this.AS.commandinDB('get',this.routeParams);
    if(resultPayload != null && this.routeParams != undefined){
      this.router.navigate(['register', this.routeParams]);
    }else{
      this.router.navigate(['register']);
    }
  }

  async forgetPassword(){
    let resultPayload = await this.AS.commandinDB('get',this.routeParams);
    if(resultPayload != null && this.routeParams != undefined){
      this.router.navigate(['forgetpassword', this.routeParams]);
    }else{
      this.router.navigate(['forgetpassword']);
    }
  }


  
  async login(){
    this.loader(true);

    let credential = {'username': this.formData['user'], 'password': this.formData['pass']};
    console.log('credential',credential);
    this.AS.loggingIn(credential).subscribe(res=>{

      console.log('Loggin In:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              if(res['data']['token'] == null || res['data']['token'] == undefined){
                this.AS.alert('Fatal Err: Login verification failed, Please try again');
                console.log('Fatal Err: Login verification failed, Please try again=>','No token Found');
              }else{
                this.loginSuccessGo(res);
              }
              
              
            }else{
               this.AS.alert('Username of password incorrect');
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

  async socialLogin(){
    this.loader(true);
     
    let credential =  {
                      "username": this.socialUser.email,
                      "uniqueToken": this.socialUser.authToken,
                      "loginWith": this.socialUser.provider
                  }
    this.AS.socialLoggingIn(credential).subscribe(res=>{

      console.log('Loggin In:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              
              this.loginSuccessGo(res);
            }else{
               this.AS.alert('Username of password incorrect');
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


  async loginSuccessGo(res){
    
    let session = [];
    session['sessionId'] = res['data']['token'];
    this.AS.sessionCTRL('set',session);
    if(this.socialUser != undefined){
      await this.AS.userCTRL('set',JSON.stringify(this.socialUser));
    }else{
      await this.AS.userCTRL('set',JSON.stringify(res['data']));
    }
    

    let resultPayload = await this.AS.commandinDB('get',this.routeParams);
    if(resultPayload != null && this.routeParams != undefined){
      
      try{
        if(resultPayload.constructor.toString().indexOf('String') != -1){
          resultPayload = JSON.parse(resultPayload);
        }
        this.AutoSubmitTest(resultPayload);
      }catch(ex){
        console.log('No test found');
      }
      
      
    }else{
      this.AS.alert('Login successfully');
      window.location.assign('/');
    }

  }


  AutoSubmitTest(resultPayload){
    
    let payload = resultPayload['payload'];
    let testTypeId = resultPayload['test_type_id'];
    let quizAllQuestions = resultPayload['quiz_all_question'];
    if(payload == null){
      this.AS.alert('Login successfully');
      window.location.assign('/');
      return;
    }
    
    this.bhopuBajao();
    this.AS.alert('Login successfully, Please wait Test is submitting.');
    this.loader(true);
    
    let payload_power = [];
    this.AS.submitQuizTest(payload).subscribe(res=>{

      console.log('Submit Quiz:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              
              if(testTypeId == 3){
                this.AS.oneTimeSaveDataCTRL('set',quizAllQuestions);
              }
              this.AS.alert('Test successfully Submitted');

              payload_power.push([payload],[res]); 
              this.router.navigate(['result', JSON.stringify(payload_power)]);

              this.AS.commandinDB('clear',this.routeParams);
            }else{
              this.AS.alert('Test Submition failed, try again');
            }
            
          }else{
            this.AS.alert('empty data');
            this.AS.alert('Test Submission failed, try again');
          }

      
      this.loader();

    },(err)=>{
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })    

  }

 







}
