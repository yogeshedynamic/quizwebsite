import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {


  showNextBtn = false;
  currentSlideInfo = {'currentSlideIndex': 0};
  isLoggedIn:boolean = false;
  routeParams:any;
  quizState = {
    'instruction': true,
    'questions': false,
    'submit': false
  }

  quizAllQuestions = [];
  quizAllAnswers = [];
  testList:any;
  refinedTestList:any;

  formData:any = {};
  alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router, private cdRef:ChangeDetectorRef) { 

  }

  ngOnInit(): void {
    this.initCheckAlreadyLoggedIn();
    this.getRouteParams();
    
  }

  ngOnDestroy(): void{
    this.initTimer();
  }

  quizStateReset(){
    this.quizState = {
    'instruction': true,
    'questions': false,
    'submit': false
    }
  }


  //-----------------------------------------------------------
  
  timerCount = 0;
  timerCTRL(currentTime){
    if(currentTime == 0){
      if(this.timerCount == 0){
        this.timeLeft = 5*60;
        this.timerCount++;
        this.startTimer();
        this.AS.alert('TIME is up!! you have 5 minutes to submit');
      }else{
        this.router.navigate(['/home']);
      }
    }
  }
  
  timeLeft: number = 10; // in seconds
  timeInterval;

  startTimer() {
    this.timeInterval = setInterval(() => {
      if(this.timeLeft == 0){
        this.pauseTimer();
        this.timerCTRL(this.timeLeft);
      }else if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.timeInterval);
  }
  initTimer(){
    clearInterval(this.timeInterval);
    this.timeLeft = 0;
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  //---------------------------------------------------------------


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
        let paramData = JSON.parse(params['routeData']);
        console.log('route params',paramData);
        if(Object.keys(paramData).length > 0){
          this.routeParams = paramData;

          setTimeout(()=> this.getTestList(),200);
        }
      }
      
      
    });
  }


  getObjectData(param,data){

    if(param == 'keys'){
      return Object.keys(data);
    }else if(param == 'values'){
      return Object.values(data);
    }
  }

  startTest(){
      if(!!this.routeParams){
        this.formData.age = 13;
        if(this.formData.age == undefined || this.routeParams.type == undefined){
          this.AS.alert('Please select age');
          return;
        }
      }else{
        this.AS.alert('Please select Test from homepage');
        return;
      }
      

      
      let refinedTestList = this.testList.filter(x=> x.age <= this.formData.age && x.language_id==1 && x.test_type_id == this.routeParams.type);
      if(this.getObjectData('keys',refinedTestList).length > 0){
        this.refinedTestList = refinedTestList[refinedTestList.length - 1 ];
      }else{
        this.AS.alert('No test found');
        return;
      }

      let refinedTestId = this.refinedTestList.id;
      console.log(this.refinedTestList);
      if(refinedTestId != undefined){
          this.quizState['instruction'] = false;
          this.quizState['questions'] = true;
          
          let params = 'questions/tests?testId='+refinedTestId+'&testTypeId='+this.routeParams.type+'&languageId=1&age='+this.formData.age;
          console.log('params==>',params);
          this.getQuizQuestions(params);
      }else{
        this.AS.alert('ERR: Test Not Found');
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
        }else{
          this.AS.alert('Response success failed');
        }
        
      }else{
        this.AS.alert('Empty data');
      }

      this.loader();
    },(err)=>{
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })


  }



  async getQuizQuestions(params){
    this.loader(true);
     
    
    this.AS.getQuestions(params).subscribe(res=>{

      console.log('quiz all questions:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
             this.quizAllQuestions = res['data'];
             this.quizAllQuestions.map(x=> x.useranswer = {'answer':undefined,'answerIndex':undefined});
             
             if(this.refinedTestList.timer !=null){
                this.startTimer();
             }
             
            }else{
              this.quizStateReset();
              this.AS.alert('something went wrong please try again');
            }
            
          }else{
            this.quizStateReset();
            this.AS.alert('No questions for this test found');
          }

      this.loader();

    },(err)=>{
      this.quizStateReset();

      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })

  }


  getNextButton(currentSlideIndex){
    
    if(this.quizAllQuestions[currentSlideIndex]?.useranswer?.answerIndex != undefined){
      if(currentSlideIndex < this.quizAllQuestions.length -1){
        this.showNextBtn = true;
        return;
      }
    }

    this.showNextBtn = false;

    this.cdRef.detectChanges();
  }
  getCurrentSlideInfo(){
    setTimeout(_=>{
      let getCurrentSlideIndex = parseInt(document.querySelector('.quiz-slider .item.active').getAttribute('id'));
    
      this.currentSlideInfo = {'currentSlideIndex': getCurrentSlideIndex};
      this.getNextButton(this.currentSlideInfo.currentSlideIndex);
      console.log('currentSlideIndex',this.currentSlideInfo);
    },150);

  }


  nextButtonClick(){
    if(document.querySelector('#next') != null){
      document.querySelector('#next')['click']();
    }
  }
  selectAnswer(qId,optionIndex){

    let qIndex = this.quizAllQuestions.findIndex(x=> x.id == qId);
    let answer = this.alphabet[optionIndex];
    //quizAllQuestions[qIndex].question_options.options[optionIndex].value;
    //set answer

    let existedMarkedAnswer = this.quizAllQuestions[qIndex].useranswer.answer!=undefined?true:false;
    this.quizAllQuestions[qIndex].useranswer = {'answer':answer,'answerIndex':optionIndex};
    this.getCurrentSlideInfo();

    console.log('Q=>',qIndex,'answer=>',answer);
    if(existedMarkedAnswer){
      //return;
    }
    
    if(qIndex < this.quizAllQuestions.length-1){
      setTimeout(_=>{
        this.nextButtonClick();
      },0);
    }
    
  }

  generateSubmitAnswersList(){
    //without answer no submit
    if(this.quizAllQuestions.filter(x=> x.useranswer.answer == undefined || x.useranswer.answerIndex == undefined).length>0){
      this.AS.alert('All Answers are mandatory');
      return null;
    }

   let payload = {
    "testId": this.refinedTestList.id,
    "testTypeId": this.routeParams.type,
    "submission": []
    }

    if(this.refinedTestList.test_type_id == 1){
      this.quizAllQuestions.forEach((x,i)=>{
        payload.submission.push(
          {
                "questionId":x.id,
                "question": "",
                "questionOrder": x.question_order != undefined?x.question_order:null,
                "questionType": x.question_type != undefined?x.question_type:null,
                "answer": x.useranswer.answerIndex != undefined?this.getObjectData('values',x.question_options.options)[x.useranswer.answerIndex]['value']:null
          }
        )      
      })
    }else{
      this.quizAllQuestions.forEach((x,i)=>{
        payload.submission.push(
          {
                "questionId":x.id,
                "question": "",
                "questionOrder": x.question_order != undefined?x.question_order:null,
                "questionType": x.question_type != undefined?x.question_type:null,
                "answer": x.useranswer.answer != undefined?x.useranswer.answer:null
          }
        )      
      })

    }


    console.log('submit payload', payload);

    return payload;

  }


  guidGenerator(){
    let S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }


  checkDateValidation(){
    let result = true;

    let d1 = new Date();
    let d2 = new Date("May 31 2021");
    if(d1.getTime() > d2.getTime()){
      result = false;
    }

    return result;
  }

  submitTest(){
    
    if(this.checkDateValidation()==false){
      return;
    }
    
    let payload = this.generateSubmitAnswersList();
    if(payload == null){
      return;
    }

    //check user logged in or not

    if (this.isLoggedIn == false || this.isLoggedIn == undefined){
       let resultSaveId = this.guidGenerator();
       let savePayload = {'payload':payload, 'test_type_id': this.routeParams.type,'quiz_all_question':this.quizAllQuestions };
       
       let savePayloadString = JSON.stringify(savePayload);
       this.AS.commandinDB('set',resultSaveId,savePayloadString);
       this.AS.alert('Please login to submit test');

       this.router.navigate(['/login',resultSaveId]);

       return;
    }
    
    this.loader(true);
    
    let payload_power = [];
    this.AS.submitQuizTest(payload).subscribe(res=>{

      console.log('Submit Quiz:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              
              if(this.routeParams.type == 3){
                this.AS.oneTimeSaveDataCTRL('set',this.quizAllQuestions);
              }
              this.AS.alert('Test successfully Submitted');

              payload_power.push([payload],[res]); 
              this.router.navigate(['result', JSON.stringify(payload_power)]);
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

  processImg(x,img){
    if(x.test_type_id==3)
    return img?true:false;
    else return undefined
  }






}
