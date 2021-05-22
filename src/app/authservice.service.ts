import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';



import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider,AmazonLoginProvider,VKLoginProvider,MicrosoftLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable({
  providedIn: 'root'
})

export class AuthserviceService {


  //ss-------
  GoogleLoginProvider = GoogleLoginProvider;
  FacebookLoginProvider = FacebookLoginProvider;
  AmazonLoginProvider = AmazonLoginProvider;
  VKLoginProvider = VKLoginProvider;
  MicrosoftLoginProvider = MicrosoftLoginProvider;

  //ss-------

  public API:any = [];
  public OneTimeSaveData:any;
  private dataSubject = new Subject<any>();
  public headers:HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' }) ;


  //API_URL = 'http://15.207.230.228:3030/api/v1/';
  API_URL = 'https://appapi.dishakiran.com/api/v1/';
  constructor(public http: HttpClient,private authService: SocialAuthService) { 
     
  }

  broadCastData(data: any) {
    this.dataSubject.next(data);
  }

  getLiveBroadCastData(): Subject<any> {
    return this.dataSubject;
  }


  //ss-------------------------------------

  getSocialSharePlatformLoggedInDetails(){
    return this.authService.authState;
  }
  
  async signInWithGoogle() {
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  async signInWithFB() {
    await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  async signInWithAmazon() {
    await this.authService.signIn(AmazonLoginProvider.PROVIDER_ID);
  }

  async signInWithVK(){
    await this.authService.signIn(VKLoginProvider.PROVIDER_ID);
  }

  async signInWithMicrosoft(){
    await this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  async socialSignOut() {
    await this.authService.signOut();
    alert('logged out, try to refresh g token, it wont');
  }

  async refreshToken(param) {
    if(param == 'google'){
      await this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }
    
  }

  loggedInViaCTRL(param = null,refresh = false){
    
    if(refresh == true){
      if(param=="google"){
        this.refreshToken(param);
      }else if(param=="fb"){
        
      }
    }else{
      if(param=="google"){
        this.signInWithGoogle();
      }else if(param=="fb"){
        this.signInWithFB();
      }
    }

    if(param=='signOut' || param == null){
        this.socialSignOut();
    }
     
  }

  //ss-------------------------------------

  commandinDB(command,key = null,value = null){
    if(command == "set"){
      localStorage.setItem(key, value);
    }else if(command == "get"){
      return localStorage.getItem(key);
    }else if(command == "clear"){
      if(key !=null){
        localStorage.removeItem(key);
      }else{
        localStorage.clear();
      }
      
    }
  }

  async sessionCTRL(command,session=null){
    
    if(command == "set" && session != null){
      console.log('Session Id',session);
      await this.commandinDB("set",'token',session['sessionId']);
    }else if(command == "get"){
      return await this.commandinDB("get",'token');
    }else if(command == "clear"){
      await this.commandinDB("clear",'token');
    }

     
  }

  async userCTRL(command,value=null){
    
    if(command == "set" && value != null){
      console.log('user',value);
      await this.commandinDB("clear",'user');
      await this.commandinDB("set",'user',value);
    }else if(command == "get"){
      let user = await this.commandinDB("get",'user');
      if(user != null || user != undefined){
        return JSON.parse(user);
      }
      return null;
    }else if(command == "clear"){
      await this.commandinDB("clear",'user');
    }

     
  }

  async isLoggedIn(){
    let session =  await this.sessionCTRL('get');
    
    if(!!session){
      console.log('Guard session:',session);
      
      if(!!session){
        return true;
      }
    }

    return false;
    
  }

  async loggedOut(){
    let session =  await this.sessionCTRL('get');
    
    if(!!session){
      await this.sessionCTRL('clear');
      await this.userCTRL('clear');
    }

    return true;
  }



  async screenLoader(command) {
     
    if(command=="show"){
      
    }else if(command=="hide"){

    }
  }

  alert(msg, position = null, duration=2000) {
     this.modalFire(msg);
  }

  alertConfirm(msg,msgType=null) {
     
  }

  getCurrentDateTime(){
    let today = new Date();
    let todayDateTime = {
    "date": today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
    "time": today.getHours()+":"+(today.getMinutes()+1)+":"+today.getSeconds()
    };
    return todayDateTime;
  }

  oneTimeSaveDataCTRL(command,data=null){
    if(command == "get"){
      return this.OneTimeSaveData;
    }else if(command == "set"){
      this.OneTimeSaveData = [];
      this.OneTimeSaveData.push(data);
      return true;
    }else if(command == "clear"){
      this.OneTimeSaveData = undefined;
      return true;
    }
  }

  checkRes(json){
    
    if(json.data == '' || json == '' || json.data == null  || json.data == undefined){
      console.log('API: DATA Empty',json.data);
      //alert('Server Error! please try next time');
      return 'empty';
    }else{
      return 'data';
    }
  }

  getApi(par){
    
    if(par=='login'){

      return 'https://run.mocky.io/v3/620211b2-06c5-40b8-9384-44f11b38e522'; //success
      //return 'https://run.mocky.io/v3/271a5892-42d7-4c95-abc9-fcc960d3f11c'; // pass incorrect
    }else if(par == 'registerUser'){
       
      return 'https://run.mocky.io/v3/e0a7b0a5-1116-4322-a870-6e415abbfaed'; //success
      return 'https://run.mocky.io/v3/1c06e789-d9e9-423b-a641-cad873e01f48'; //mobile number already exist
    }else if(par == 'languageList'){
      
      return this.API_URL+'languages'; //success
      return 'https://run.mocky.io/v3/1c06e789-d9e9-423b-a641-cad873e01f48'; //mobile number already exist
    }else if(par == 'testType'){
       
      return this.API_URL+'test-types';
      return 'https://run.mocky.io/v3/320347f5-a8d9-45da-9494-d93e7fbc1ca5'; //success
      
    }
    else if(par == 'testAge'){
       
      return 'https://run.mocky.io/v3/e0a7b0a5-1116-4322-a870-6e415abbfaed'; //success
      return 'https://run.mocky.io/v3/1c06e789-d9e9-423b-a641-cad873e01f48'; //mobile number already exist
    }else if(par == 'allTest'){
      
      return this.API_URL+'tests';
      return 'https://run.mocky.io/v3/31f01678-2d2c-4442-89d3-d26fc34fa963'; //success
    }else if(par == 'allQuestions'){
      
      return this.API_URL+'questions'; //success
      return 'https://run.mocky.io/v3/53a418d4-c258-4cf9-bd42-a22d79b3bae8'; //success
      //return 'https://run.mocky.io/v3/1c06e789-d9e9-423b-a641-cad873e01f48'; //mobile number already exist
    }
  
  }

  
  //website

  loggingIn(payload){
    return this.http.post(this.API_URL+'users/login', payload, {headers: this.headers});
  }

  socialLoggingIn(payload){
    return this.http.post(this.API_URL+'users/login/social', payload, {headers: this.headers});
  }

  register(payload){
    return this.http.post(this.API_URL+'users/', payload, {headers: this.headers});
  }

  forgetPassword(payload){
    return this.http.post(this.API_URL+'users/login/forgot', payload, {headers: this.headers});
  }

  submitQuizTest(payload){
    return this.http.post(this.API_URL+'tests/result', payload, {headers: this.headers});
  }

  createOrder(payload,paymentMethod = null){
    // if(paymentMethod == "razorpay"){
    //   return this.http.post(this.API_URL+'payments/orders', payload, {headers: this.headers});
    // }else{
      
    // }

    return this.http.post(this.API_URL+'payments/orders', payload, {headers: this.headers});
    
  }

  createOrderCoupen(payload){
    return this.http.post(this.API_URL+'promo/apply', payload, {headers: this.headers});
  }

  createOrderCoupen100(payload){
    return this.http.post(this.API_URL+'payments/makepaymentforzero', payload, {headers: this.headers});
  }

  getProfileData(){
    return this.http.get(this.API_URL+'users/me', {headers: this.headers});
  }
  getProfileResultPDFData(payload){
    return this.http.post(this.API_URL+'payments/pdf', payload, {headers: this.headers});
  }

  zohoMail(payload){
    let url = 'https://flow.zoho.in/60007500655/flow/webhook/incoming?zapikey=1001.e5d2ed467106682bbaa79ceb177e5c25.f9cfcca7f6fec5ddfd43fa551c15dbe6&isdebug=false%27&key=123456789';
    let headers:HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','key': '123456789' });
    //let headers:HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' }) ;
    return this.http.post(url, payload, {headers: headers});
  }

  //admin
  
  getLanguages(){
    //this.http.post(this.getApi('otpverify'), data, {headers: this.headers});
    return this.http.get(this.getApi('languageList'));
  }

  getTestType(){
    //this.http.post(this.getApi('otpverify'), data, {headers: this.headers});
    return this.http.get(this.getApi('testType'));
  }

  getTestAge(){
    //this.http.post(this.getApi('otpverify'), data, {headers: this.headers});
    return this.http.get(this.getApi('testAge'));
  }

  getTestList(){
    //this.http.post(this.getApi('otpverify'), data, {headers: this.headers});
    return this.http.get(this.getApi('allTest'));
  }

  getQuestions(param){
    if(param == 'all'){
        return this.http.get(this.getApi('allQuestions'));
    }else{
      return this.http.get(this.API_URL+param);
    }
    
  }

  //submit process

  submitForm(param,payload){
    if(param == 'createTest'){
      return this.http.post(this.API_URL+'tests', payload, {headers: this.headers});
    }else if(param == 'createQuestion'){
      return this.http.post(this.API_URL+'questions', payload, {headers: this.headers});
    }else if(param == 'updateQuestion'){
      return this.http.put(this.API_URL+'questions', payload, {headers: this.headers});
    }else if(param == 'deleteQuestion'){
      return this.http.delete(this.API_URL+'questions'+'/'+payload);
    }


  }



  modalFire(msg,title="Alert",ok='OK'){
   let modal = `<div id="mymodal" class="modal show" tabindex="-1" role="dialog"  aria-hidden="true" style="background:#808080cc">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" aria-hidden="true" onclick="document.querySelector('#mymodal').remove()">×</button>
                        <h4 class="modal-title"  >${title}</h4>
                    </div>
                    <div class="modal-body">
                        <p>${msg}</p>
                         
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="document.querySelector('#mymodal').remove()">${ok}</button>
                    </div>
                </div>
                
            </div>
             
        </div>
        `;
     
      var div = document.createElement('div'); //container to append to
      div.innerHTML = modal;
      if (div.children.length > 0) {
        document.body.appendChild(div.children[0]);
      }
    //alert(msg);
  }
  




  //razorpay
  get nativeWindow(): any {
      return _window();
  }





  resultMapper(param){


    let codeToNumber = {
          "ACE": "1",
          "ACS": "2",
          "ACI": "3",
          "AEI": "4",
          "AIS": "5",
          "CEI": "6",
          "CIS": "7",
          "EIS": "8",
          "ACR": "9",
          "AER": "10",
          "ARS": "11",
          "CER": "12",
          "AIR": "13",
          "CIR": "14",
          "EIR": "15",
          "IRS": "16",
          "CRS": "17",
          "ERS": "18",
          "EFJN": "19",
          "EFNP": "20",
          "EJNT": "21",
          "ENPT": "22",
          "EFJS": "23",
          "EFPS": "24",
          "EJST": "25",
          "EPST": "26",
          "FIJN": "27",
          "FINP": "28",
          "IJNT": "29",
          "INPT": "30",
          "FIJS": "31",
          "FIPS": "32",
          "IJST": "33",
          "IPST": "34"
    }

    let numberToDetail =  {
          "1": "You have the ability to think creatively and communicate their ideas. You are good at managing teams and pushing each team member to do their best. You are able to express their thoughts, ideas and plans clearly. You have a futuristic orientation and make plans accordingly. You excel at organization and people look up to them for directing the team.",
          "2": "You have good speaking and listening skills to express their thoughts clearly. You are able to develop learning plans for people of all ages and help them implement these plans. You have new and relevant knowledge to impart and are able to maintain meaningful relationships with their students. You have a strong hold over language as well as technical knowledge.",
          "3": "You have good communication skills and express their thoughts clearly. You have an understanding of what information attracts consumers. You are able to manage groups of people and ensure harmonious work environment. You are future oriented. You are curious and seek answers about understanding of the world.",
          "4": "You have good communication skills and are able to express their ideas clearly. You are able to simplify concepts and make information easy to retain. You are good at organizing tasks and getting others to complete them. You care for the nature and for their teammates. You are visionary and future oriented.",
          "5": "You have good speaking and listening skills to express their thoughts clearly. You are able to simplify concepts and make information easy to retain. You are good at organizing tasks and getting others to complete them. You have new and relevant knowledge to impart and are able to maintain meaningful relationships with their students or teammates.",
          "6": "You have good problem solving and thinking abilities. You can come up with solutions to any situation. You show preference to professions involving the environment or finance. You have great organization abilities and a keen interest in technology. You are future oriented and have a long term vision.",
          "7": "You are active listeners and thinkers. You have the ability to tell when something is going to go wrong and come up with solutions for it. You are empathetic and hence, suitable to the field of medical service. You are able to observe and evaluate people’s problems rationally. You understand how technology can be used most effectively.",
          "8": "You are good listeners and active thinkers. You have high degree of self-control and critical thinking abilities. You care for others and are able to express their thoughts clearly. You are able to make observations and draw conclusions. You pay attention to detail and plan for the future effectively.",
          "9": "You have good communication skills and can easily talk to new people. You are able to express their creativity through science and other such unconventional ways. You are able to execute a plan and have clear vision. You are able to maintain deep meaningful relationships.",
          "10": "You have good listening and speaking abilities. You are able to get suitable information needed to understand a situation and are good problem solvers. You can work to optimize land utilization because of their knowledge of dimensions. You are able to execute plans precisely and are able to deal with unexpected obstacles.",
          "11": "You have a mix of good communication skills, creativity and business sense. You listen carefully and are able to understand others on a deeper level. You enjoy organizing and managing many tasks at once. You have good observation skills and suitable attention span to tend to details. You have fine reasoning and problem solving abilities.",
          "12": "You are good listeners and orators. You are able to monitor and manage people easily. You find success in businesses that require scientific thought and manual application. You desire public safety and welfare of all. You are able to execute plans precisely and are able to deal with unexpected obstacles. You are able to understand situations and think deeply.",
          "13": "You have good listening and speaking abilities. You are able to get suitable information needed to understand a situation and are good problem solvers. You are able to execute a plan and have clear vision. You have new and relevant knowledge to impart and are able to maintain meaningful relationships with their students or teammates.",
          "14": "You have good problem solving and thinking abilities. You can come up with solutions to any situation. You show preference to professions involving the environment or finance. You have good observation skills and suitable attention span to tend to details. You have fine reasoning and problem solving abilities.",
          "15": "You have good listening and speaking abilities. You are able to get suitable information needed to understand a situation and are good problem solvers. You show preference to professions involving the environment or finance. You have great organization abilities and a keen interest in technology. You are future oriented and have a long term vision.",
          "16": "You are good listeners and active thinkers. You have high degree of self-control and critical thinking abilities. You care for others and are able to express their thoughts clearly. You have great organization abilities and a keen interest in technology. You are future oriented and have a long term vision.",
          "17": "You are good communicators with superior writing skills. You thrive in tasks of community management. You have good observation skills and suitable attention span to tend to details. You show preference for working in the healthcare sector since You are caring and technically able. You have fine reasoning and problem solving abilities.",
          "18": "You have good listening and speaking abilities. You are able to get suitable information needed to understand a situation and are good problem solvers. You are good at training others and working directly with the public. You take initiative and are able to achieve targets set for them.",
          "19": "ENFJs are energetic and ambitious individuals. They tend to be positive and bold. They are aware of the human suffering and work for human growth. They are emotional and believe in values. They are sociable and pleasant individuals. They see good traits in everyone and try to bring everyone together. They are good communicators and trusted by all. They get easily excited and want to take up all opportunities.",
          "20": "ENFPs are energetic, outgoing and spontaneous individuals. They are creative and enthusiastic and always come up with new and original ideas. Being warm and compassionate, they also love to help others explore their creative potential.",
          "21": "ENTJs are hard-working and ambitious. They often love working with others towards a common goal. They are friendly and outgoing. They are also assertive and like taking charge of things. They are smart and logical. They are focused about their goals and energetic while working. They have difficulty in expressing emotions and being flexible.",
          "22": "ENTPs are intellectual and innovative. They are motivated to find new solutions to intellectually challenging problems. They are on a constant quest for knowledge. They have a tendency to analyze, understand, and influence other people.",
          "23": "ESFJs are kind and helpful. They are energetic and dedicated to their responsibilities. They are sensitive to the feelings of others and make their family and friends their top priority. They are harmonious and cooperative. They typically enjoy routine and keep a regular schedule that allows them to be productive and organized. As teens, ESFJs are usually popular and they become more supportive of their friends with age. They are respectful and try to include everyone in their activities. They can find it tough to not be sensitive but learning to do so can help them excel.",
          "24": "ESFPs are cheerful, energetic and fun loving who tend to find pleasure in everything around them. They are always lively and never fail to be the centre of everyone’s attention. They are talkative and have a playful sense of humour which makes them fun to be around. They excel in fields that involve working with others and having new experiences. They may face difficulty in long term planning but overcoming this allows them to make their dreams come true. They are the life of the party and like it that way.",
          "25": "ESTJs are energetic, practical and self-satisfied individuals. They are hard-working and like to do things in a systematic and organized manner. They excel at setting goals, making decisions and organizing resources to accomplish a task. They like to take charge of projects and people working with them.",
          "26": "ESTPs are social, active and playful human beings. They are energetic and are often the life of the party. They are not afraid to take risks. They live in the moment and can easily apply their logical reasoning to situations where immediate action is necessary. They also have a keen sense of observation.",
          "27": "INFJs are sensitive, loving and hopeful individuals. They are always ready to help others. They are warm and affirming by nature. They love the opportunity to solve problems and bring about positive change in the world. They want to work for the good of the society and nothing can make them change their path. They might feel held back when they get struck in routine tasks. They are determined to achieve their goal of equality in society.",
          "28": "INFPs are sensitive, caring and compassionate individuals. They enjoy exploring their own ideas and are often creative and artistic. They are guided by their core values and beliefs. They are deeply concerned with the personal growth of themselves and others.",
          "29": "INTJs are often logical and methodical individuals. They are independent and mostly focused on their own thoughtful study of the world around them. They are innovative and approach every problem analytically as they come up with new solutions.",
          "30": "INTPs are highly intellectual and imaginative. They are great observers and like to understand the ‘why’ to everything they come across. They spend much of their time focused internally. They have the ability to explore concepts, make connections and seek and understand the mysteries of the universe.",
          "31": "ISFJs are compassionate and caring individuals who are always motivated to provide for others. They are reliable and trustworthy. They feel like they have a deep sense of responsibility towards others. They are committed to their work and are very responsible.",
          "32": "ISFPs are spontaneous and like to go with the flow. They are warm and friendly individuals who like to live in the present moment and enjoy their surroundings.  They often have a natural talent for the arts. They like to enjoy the simple pleasures of life, that is, friends, family, food, music and art.",
          "33": "ISTJs are patient and productive individuals. They are organized and structured and tend to follow a procedure for everything they do. They follow the regulations responsibly and maintain the social order. They are highly dependable and when given something to do, they are likely to follow it through the end.",
          "34": "ISTPs are independent and innovative. They like to be free, spontaneous and follow their own lead. They are curious and attentively observe their surroundings, noticing how things work."
          }



      if(param == 'codeToNumber'){
        return codeToNumber;
      }else if(param == "numberToDetail"){
        return numberToDetail;
      }else if('all'){
          return [codeToNumber,numberToDetail];
      }

  
  
  }




}
