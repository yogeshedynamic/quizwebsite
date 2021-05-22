import { Component, OnInit, NgZone } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  routeParams:any;
  token:any;

  orderData:any;
  
  basicAmount: number;
  amount:number;
  discount:number = 0;

  formData:any = {};

  submit = "Proceed to pay";

  constructor(private AS:AuthserviceService, private route: ActivatedRoute, private router:Router, private zone: NgZone) { 

  }

  ngOnInit(): void {
    this.initCheckAlreadyLoggedIn();
    this.getRouteParams();
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

          setTimeout(()=> this.initSummary(),300);
        }
      }
      
      
    });
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
          this.token = res['token'];
        }else{
          this.router.navigate(['/login']);
        }

        this.loader();
        
      }, err=>{
        this.router.navigate(['/login']);
        this.loader();
      });
  }


  //-------------------------------------------------------------------

  createRzpayOrder(order_id,price) {
    // let order_id = 'order_Gh4u6xsJemDiAZ';
    // let price = 125500;
    console.log(order_id, price);
    // call api to create order_id
    this.payWithRazor(order_id, price);
  }


  payWithRazor(val, price) {
    const options: any = {
      key: 'rzp_live_d2YKTJ3Bbhrp6D',
      amount: price, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Payment for result', // company name or product name
      description: '',  // product description
      image: '../assets/images/newimages/logo.png', // company logo or product image
      order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      this.verifyOrder();
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      this.AS.alert('Transaction cancelled.');
    });
    const rzp = new this.AS.nativeWindow.Razorpay(options);
    rzp.open();
  }

  //-------------------------------------------------------------------

  callCoupenAPI(){
    if(this.formData.coupen == undefined){
      this.AS.alert('Please enter coupen first then apply');
      return;
    }

    let payload = {
              "code": this.formData.coupen
              };
    this.AS.createOrderCoupen(payload).subscribe(res=>{

      console.log('calling coupen:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              let percentage = res['data']['percentage'];
              if(percentage){
                percentage = parseInt(percentage);
                
                let percentageAmmount =  (this.basicAmount * percentage)/100;
                this.discount = percentageAmmount;
                this.AS.alert(res['message']);
                this.initSummary();
                
              }else{
                
                this.AS.alert(res['data']['message']);
              }
               
            }else{
              
              this.AS.alert('something went wrong please try again');
            }
            
          }else{
            
            this.AS.alert('No Coupen found');
          }

      this.loader();

    },(err)=>{
       
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })


  }

  initSummary(){
    this.basicAmount = parseInt(this.routeParams['price']);
    
    this.amount = (this.basicAmount - this.discount);
    
    if(this.discount == this.basicAmount){
      this.submit = "Go to result";
    }
  }

  initOrder(){
    try{
      if(this.routeParams['price'] == undefined || this.routeParams['resultId'] == undefined){
        this.AS.alert('No ammount found to pay, Please try to submit test again');
        return;
      }

      if(this.discount < this.basicAmount){
        console.log(this.formData.paymentGateway);
        if(!!this.formData.paymentGateway){
          
         
          // if(this.formData.paymentGateway != "razorpay"){
          //   this.AS.alert('Please use razorpay, others are coming soon');
          //   return;
          // }
          this.setOrder();
        }else{
          this.AS.alert('Please select payment method');
        }
        
      }else{
        //100% discount
        this.discount_100_percent_API();
      }
      
    }catch(ex){
      this.AS.alert('something went wrong, Please try again');
    }
    
  }

  setOrder(){
    
    let price = this.routeParams['price'];
    let payload = {
                    "userId": this.token,
                    "resultId": this.routeParams['resultId'],
                    "amount": this.amount
            }
    this.loader(true);
    this.AS.createOrder(payload,this.formData.paymentGateway).subscribe(res=>{

      console.log('creating order res:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
              this.orderData = res['data']['order'];
              console.log('order',this.orderData);

              let order_id = this.orderData.id;
              let price = this.orderData.amount;
              this.createRzpayOrder(order_id,price);
            }else{
              
              this.AS.alert('something went wrong please try again');
            }
            
          }else{
             
            this.AS.alert('No Data found in our directory');
          }

      this.loader();

    },(err)=>{
       
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })






  }

  verifyOrder(){

    let payload = {
                    "userId": this.token,
                    "resultId": this.routeParams['resultId'],
                    "amount": this.amount,
                    "orderId": this.orderData.id,
                    "payment": {}
              }
    this.loader(true);
    this.AS.createOrder(payload,this.formData.paymentGateway).subscribe(res=>{

      console.log('verify order res:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
               
              console.log('order',this.orderData);
              this.AS.alert('Paid Verified Successfully');
              this.goToProfilePage();
            }else{
              
              this.AS.alert('something went wrong please try again');
            }
            
          }else{
             
            this.AS.alert('No Data found in our directory');
          }

      this.loader();

    },(err)=>{
      
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })






  }


  discount_100_percent_API(){

    let payload = {
                    "userId": this.token,
                    "resultId": this.routeParams['resultId'],
                    "amount": 0,
                    "promo": this.formData.coupen
              }
    this.loader(true);
    this.AS.createOrderCoupen100(payload).subscribe(res=>{

      console.log('order 100% coupen res:',res);
      let checkRes = this.AS.checkRes(res);
          if(checkRes == 'data'){
            if(res['status'] == 'success'){
               
              console.log('order',this.orderData);
              this.AS.alert('100% discount Applied, proceeding to the result page');

              this.goToProfilePage();
              
            }else{
              
              this.AS.alert('something went wrong please try again');
            }
            
          }else{
             
            this.AS.alert('No Data found in our directory');
          }

      this.loader();

    },(err)=>{
       
      this.AS.alert('Internet Error! please check your internet');
      console.log('Err:',err);
      this.loader();
    })

  }

  goToProfilePage(){
    this.zone.run(() => {
      this.router.navigate(['/profile']);
    });
  }

















}
