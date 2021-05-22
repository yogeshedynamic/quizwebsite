import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-form-submit',
  templateUrl: './form-submit.component.html',
  styleUrls: ['./form-submit.component.scss']
})
export class FormSubmitComponent implements OnInit {

  formData:any = {};
  routeParams:any;

  pageData = {
    'heading': undefined,
    'text': undefined
  };
  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router) { 

  }


  ngOnInit(): void {
    //this.initCheckAlreadyLoggedIn();
    this.pageData = {
      'heading': undefined,
      'text': undefined
    };  
    this.getRouteParams();

    //this.pageDataCTRL('counselling');
  }


  loader(par = false){
    if(par){
      this.AS.screenLoader('show');
    }else{
      this.AS.screenLoader('hide');
    }
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

          setTimeout(()=> this.pageDataCTRL(this.routeParams),200);
        }
      }
      
      
    });
  }


  formValidation(){
    if(this.formData.query != undefined){
       
        return true;
       
    }
    
    return false;
  }

  async formSubmit(){
    this.loader(true);

    let validateForm = await this.formValidation();
    if(validateForm==false){
      this.AS.alert('Please write your query');
      return;
    }

    let credential = {
    "fullName": this.formData['name'],
    "contactDetail": this.formData['user'],
    "query": this.formData['query'],
    "type": this.routeParams
    }

    console.log('Form submission payload:',credential);
    this.AS.zohoMail(credential).subscribe(res=>{

      console.log('Form submission res:',res);
          //let checkRes = this.AS.checkRes(res);
          // if(checkRes == 'data'){
          //   if(res['status'] == 'success'){
                
          //      this.AS.alert('Thank you for your interest, We will contact you');
          //       this.router.navigate(['home']);
          //   }else{
          //      this.AS.alert('Form submission failed, please try again');
          //   }
            
          // }else{
          //   this.AS.alert('empty data');
          // }

      this.AS.alert('Thank you for your interest, We will contact you');
      this.router.navigate(['home']);

      this.loader();

    },(err)=>{
      this.AS.alert('Something went wrong, please try again');
      console.log('Err:',err);
      this.loader();
    })


  }


  pageDataCTRL(param){
    if(param == "counselling"){
      this.pageData = {
        'heading': 'Get a counsellor',
        'text': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      };
    }else if(param == "mentor"){
      this.pageData = {
        'heading': 'Get a mentor',
        'text': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      };
    }else if(param == "wellness"){
      this.pageData = {
        'heading': 'Get your wellness state',
        'text': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      };
    }else{
       this.router.navigate(['home']);
    }

  }



}
