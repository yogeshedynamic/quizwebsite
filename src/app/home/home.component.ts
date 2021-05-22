import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  routeParams:any;
  isLoggedIn:boolean = false;

  iq = {'name':'iq','type': 3};
  mbti = {'name':'mbti','type': 2};
  riasec = {'name':'riasec','type': 1};
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
          //this.router.navigate(['/']);
          this.isLoggedIn = true;
        }else{
          this.isLoggedIn = false;
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
          
          let testName = this.routeParams;
          setTimeout(()=> this.goToQuizPage(testName),200);
          
        }
      }
      
      
    });
  }

  goToQuizPage(data) {

    if(this.routeParams != undefined){
      if(['iq','mbti','riasec'].find(x=> x == this.routeParams) == undefined){
        this.router.navigate(['home']);
        return;
      }
    }


    if(data == 'iq'){
      data = this.iq;
    }else if(data == 'mbti'){
      data = this.mbti;
    }else if(data == 'riasec'){
      data = this.riasec;
    }else{
      this.AS.alert('No Test selected');
      return;
    }
    if(!!data){
      data = JSON.stringify(data);
      
      if(this.isLoggedIn == true){
        this.router.navigate(['quiz', data]);
      }else{
        this.router.navigate(['/login', data]);
      }
      
    }else{
      this.AS.alert('No data to send to quiz');
      return;
    }
  }




  //-------

  formSubmit(par){
    this.router.navigate(['/formsubmit',par]);
  }











}
