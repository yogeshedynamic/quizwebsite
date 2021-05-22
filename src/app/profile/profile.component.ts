import { Component, OnInit } from '@angular/core';

import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  user:any;
  profileData:any;
  profileResults:any;
  testList:any;
  constructor(private AS:AuthserviceService, private router:Router) { 

  }

  ngOnInit(): void {
    this.initCheckAlreadyLoggedIn();
    this.getUserDetails();
    this.getTestList();
    
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
         
        if(res){
          //this.router.navigate(['/']);
        }else{
          this.router.navigate(['/login']);
        }

        this.loader();
        
      }, err=>{
        this.router.navigate(['/login']);
        this.loader();
      });
  }


  async getUserDetails(){
    this.user = await this.AS.userCTRL('get');
    console.log('user=>',this.user);
  }

  loggedInUserUpdateWithoutSocialLogin(){
    this.user.name = this.profileData.data.user.user_fullname;
    this.user.username = this.profileData.data.user.user_username;
  }

  downloadResultPDF(url,resultId = null){
    
    if(url == null || url == undefined){
      if(resultId != null){
        this.AS.alert('Please wait your result PDF is downloading');
        this.getResultPDFdata(resultId);
      }else{
        this.AS.alert('Something went wrong!!');
        console.log('ERR: no resultId found');
      }
      
    }else{
      window.open(url,'_self');
    }

  }

  getTestList():any{
    this.loader(true);
    
    this.AS.getTestList().subscribe(res=>{

      console.log('testList:',res); 
      let checkRes = this.AS.checkRes(res);
      if(checkRes == 'data'){
        if(res['status'] == 'success'){
          this.testList = res['data'];
          this.getProfileData();
        }else{
          this.AS.alert('Something went wrong!');
        }
        
      }else{
        this.AS.alert('No data found');
      }

      this.loader();
    },(err)=>{
      if(err.error.message){
        this.AS.alert(err.error.message);
      }else{
        this.AS.alert('Internet Error! please check your internet');
      }
      console.log('Err:',err);
      this.loader();
    })


  }


  async getProfileData(){
    this.loader(true);

    this.AS.getProfileData().subscribe(res=>{

      console.log('profile Res:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              
              this.profileData = res;
              this.profileResults = this.profileData.data.results;
              this.profileResults.map(x=>  x.test_name=this.testList.find(xx=> xx.id==x.test_id).name );
              this.loggedInUserUpdateWithoutSocialLogin();
            }else{
               this.AS.alert('something went wrong please refresh page');
            }
            
          }else{
            this.AS.alert('something went wrong please refresh page');
          }

      this.loader();

    },(err)=>{
      if(err.error.message){
        this.AS.alert(err.error.message);
      }else{
        this.AS.alert('Internet Error! please check your internet');
      }
      console.log('Err:',err);
      this.loader();
    })


  }


  async getResultPDFdata(resultId){
    this.loader(true);

    let credential = {
        "resultId": resultId
    };
    console.log('pdf api call credential',credential);
    this.AS.getProfileResultPDFData(credential).subscribe(res=>{

      console.log('pdf url api res:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              if(res['data']['sharableUrl'] == null || res['data']['sharableUrl'] == undefined){
                this.AS.alert('Fatal Err: Something went wrong');
                console.log('Fatal Err: No PDF url');
              }else{
                //this.downloadResultPDF(res['data']['sharableUrl']);
                console.log('url',res['data']['sharableUrl'])
              }
              
              
            }else{
               this.AS.alert('Something went wrong, Please try again');
            }
            
          }else{
            this.AS.alert('No data found on server');
          }

      this.loader();

    },(err)=>{
      
      if(err.error.message){
        this.AS.alert(err.error.message);
      }else{
        this.AS.alert('Internet Error! please check your internet');
      }

      console.log('Err:',err);
      this.loader();
    })


  }













}
