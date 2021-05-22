import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {


  routeParams:any;
  resultData = {
    'answersCount': undefined,
    'questionCount':undefined,
    'total': undefined
  };

  resultRIASEC_MBTI = {
    'key': undefined,
    'meaning': undefined,
    'amount': undefined
  }
  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router) { 

  }

  ngOnInit(): void {
    this.initCheckAlreadyLoggedIn();
    this.getRouteParams();
    //this.getResultData();
    this.tempResultCalculator();
  }

  ngOnDestroy(){
    this.AS.oneTimeSaveDataCTRL('clear');
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
        }else{
          this.router.navigate(['/login']);
        }

        this.loader();
        
      }, err=>{
        //this.router.navigate(['/login']);
        this.loader();
      });
  }

  getResultData(){

          let result = this.AS.oneTimeSaveDataCTRL('get');
          this.resultData.total = result;  

          if(this.resultData.total == undefined){
            console.log('No result data');

            this.tempResultCalculator();
            return;
          }
          this.resultData.total = this.resultData.total[0];
          console.log('RD',this.resultData.total );
          //calculate result data
          let calculateResult = this.resultData.total.filter(x=> Object.values(x.question_options.options).findIndex(c=> c['isRightAnswer']==true) == x.useranswer.answerIndex );
          this.resultData.answersCount = calculateResult.length;
          this.resultData.questionCount = this.resultData.total.length;
  }

  tempResultCalculator(){
    
    console.log('TempRC',this.routeParams);
    if(this.routeParams[1] == undefined){
      this.AS.alert('Please attemp test first');
      return;
    }


    let data = this.routeParams[1][0]['data'];
    if(data == undefined){
      this.AS.alert('Test submission may be failed or something went wrong. Please try again');
      return;
    }

    // if(this.routeParams[0][0]['testTypeId'] == 3){
    //   this.resultData.answersCount = this.routeParams[0][0]['testTypeId'];
    // }

    this.resultRIASEC_MBTI = {
        'key': this.routeParams[1][0]['data']['result_type'],
        'meaning': this.routeParams[1][0]['data']['small_description'],
        'amount': this.routeParams[1][0]['data']['amount']
    }

    
    // if(this.routeParams[0][0]['testTypeId'] == 1){
    //   //RIASEC
    //   let mainDataResult = data.result;
    //   let resultValuesArray =  Object.values(mainDataResult);
    //   let mainData = Object.keys(mainDataResult).map(function(x,i):any { let xx = {'key':x,'value': resultValuesArray[i] }; return xx;  });
    //   let MaxToMin = mainData.sort(function (a, b) {
    //                     return b['value'] - a['value'];
    //                   });
    //   let MaxToMinAlphaOrder = MaxToMin.sort(function(a, b) {
    //                   var nameA = a['key'].toUpperCase();  
    //                   var nameB = b['key'].toUpperCase();  
    //                   if (nameA < nameB) {
    //                     return -1;
    //                   }
    //                   if (nameA > nameB) {
    //                     return 1;
    //                   }

    //                   // value must be equal
    //                   return 0;
    //                 });

    //     let resultKey_3 = MaxToMinAlphaOrder.filter((x,i):any => i<3).map(x=> x = x['key']).join('');
        
        
    //     let top_3_arr = MaxToMinAlphaOrder.filter((x,i)=> i<3);
    //     let anyDuplicateValue = top_3_arr.map((x,i)=> x = {'key':x.key,'value_count':top_3_arr.filter(c=> x.value == c.value).length}).find(x=> x.value_count > 1);
        
    //     if(anyDuplicateValue == undefined){
    //       let codeToNumer_numberToDetail = this.AS.resultMapper('all');
          
    //       this.resultRIASEC_MBTI = {
    //           'key': resultKey_3,
    //           'meaning': codeToNumer_numberToDetail[1][codeToNumer_numberToDetail[0][resultKey_3]]
    //       }
    //     }else{
    //       this.AS.alert('Answers given are invalid for interest please restart the test');
    //       this.router.navigate(['home']);
    //     }

    // }else if(this.routeParams[0][0]['testTypeId'] == 2){
    //   //MBTI

    //   let mainDataResult = data.result;
      
    //   //pairs
    //   let pair_EI = mainDataResult['e'] > mainDataResult['i']?'E':mainDataResult['e'] <= mainDataResult['i']?'I':'I';
    //   let pair_SN = mainDataResult['s'] > mainDataResult['n']?'S':mainDataResult['s'] <= mainDataResult['n']?'N':'N';
    //   let pair_TF = mainDataResult['t'] > mainDataResult['f']?'T':mainDataResult['t'] < mainDataResult['f']?'F':'T';
    //   let pair_JP = mainDataResult['j'] > mainDataResult['p']?'J':mainDataResult['j'] <= mainDataResult['p']?'P':'P';

    //   let codeToNumer_numberToDetail = this.AS.resultMapper('all');
    //   let resultKey = pair_EI + pair_SN + pair_TF + pair_JP;
    //   resultKey = resultKey.split('').sort().join('');
    //   this.resultRIASEC_MBTI = {
    //       'key': resultKey,
    //       'meaning': codeToNumer_numberToDetail[1][codeToNumer_numberToDetail[0][resultKey]]
    //     }

    // }

    
  }


  getRouteParams(){
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    // });
    this.route.params.subscribe( params => {
      if(!!params['routeData']){
        let paramData = JSON.parse(params['routeData']);
        console.log('route params',paramData);
        if(Object.keys(paramData).length > 0){
          this.routeParams = paramData;

          //setTimeout(()=> this.getTestList(),200);
        }
      }
      
      
    });
  }


  goToPayment(){
    try{
      if(this.routeParams[1][0]['data']["id"] != undefined){
        let data = {'price': this.resultRIASEC_MBTI.amount?this.resultRIASEC_MBTI.amount:399, 'resultId': this.routeParams[1][0]['data']["id"]};
        this.router.navigate(['payment', JSON.stringify(data)]);
      }
    }catch(err) {
      this.AS.alert('Something went wrong, try to submit test again');
    }
    
  }













}
