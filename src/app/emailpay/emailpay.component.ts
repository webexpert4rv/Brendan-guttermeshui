// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-emailpay',
//   templateUrl: './emailpay.component.html',
//   styleUrls: ['./emailpay.component.scss']
// })
// export class EmailpayComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

  

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";

@Component({
  selector: 'app-emailpay',
  templateUrl: './emailpay.component.html',
  styleUrls: ['./emailpay.component.scss']
})
export class EmailpayComponent implements OnInit {
  typeOneColor: any
  typeTwoColor: any
  firstPage: boolean = true;
  secondPage: boolean = false;
  secondPage1: boolean = false;
  secondPage2: boolean = false;
  secondPage3: boolean = false;
  thirdPage: boolean = false;
  protectionGutter: boolean = false;
  protectionValley: boolean = false;
  protectionArea: boolean = true;
  isAccessoriesArea: boolean = false;
  accScrewColor: boolean = false;
  isAccessoriesOptions: boolean = true;
  pay: boolean = true;
  processing: boolean = false;
  promoinput:any = ""
  code: any = ""
  regData:any = {}
  offerAmount: any = 0;
  senData: any = { name: "", phone: "", email: "", postalCode: "", suburb: "", state: "", meshColorCode: "", trimColorCode: "", street: "", type: "", product: "", subproduct: "", area: "", gutterSize: "", valleySize: "", trimColor: "", meshColor: "", isAccessories: "2", aluWidth: "", aluQuantity: "", aluColor: "", emberWidth: "", emberQuantity: "", emberColor: "", plasWidth: "", plasQuantity: "", plasColor: "", accTrimQuantity: "", accTrimColor: "", accSaddlesColor: "", accSaddlesQuantity: "", accSaddlesType: "", accScrewColor: "", accScrewQuantity: "", accScrewType: "" }
  calculatedValue: any = { isInstallation: false, instalationCost: 0, kitTotalPrice: 0, accessories: 0, deliveryCharge: 0, total: 0, gstTotal: 0, fullTotal: 0 }
  removed: boolean = false;
  applied: boolean = true;
  percentage: number
  cardname:any = ""
  installers: any;
  constructor(private toastr: ToastrService, private app: AppService, private fb: FormBuilder, private stripeService: StripeService) { }
  ngOnInit(): void {
    this.senData.email=localStorage.getItem('email');
    this.senData.name=localStorage.getItem('name');
    this.senData.phone=localStorage.getItem('phone');
    this.senData.postalCode=localStorage.getItem('postal');
    this.senData.suburb=localStorage.getItem('suburb');
    this.senData.street=localStorage.getItem('street');
    this.senData.state=localStorage.getItem('state');
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.app.getService('/color/1').then((res) => {
      this.typeOneColor = res['data']
    }).catch((err) => {
      this.toastr.error("something went wrong", 'Error')
    })

  }
  //payment code starting

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#000000',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#ec8f21'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  buy() {
    if(this.cardname == ""){
    this.toastr.error("Please enter the Card name","Error")
    }else{
      this.pay = false;
      this.processing = true;
      const name = this.cardname
      this.stripeService
        .createToken(this.card.getCard(), { name })
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            console.log(result.token.id);
            var sendingData = { token: result.token.id, amount: this.calculatedValue.fullTotal - this. calculatedValue.instalationCost, email: this.senData.email, phone: this.senData.phone }
            this.app.postService('/payment', sendingData).then((res) => {
              if (res['error']) {
                this.toastr.error(res['message'], 'Error')
                this.processing = false;
                this.pay = true;
              } else {
                this.toastr.success("Payment successfully", 'Success')
                this.processing = false;
                this.pay = true;
                this.ngOnInit()
              }
            }).catch((err) => {
              this.processing = false;
              this.pay = true;
              this.toastr.error("something went wrong", 'Error')
            })
          } else if (result.error) {
            // Error creating the token
            this.processing = false;
            this.pay = true;
            this.toastr.error(result.error.message, 'Error')
            console.log(result.error.message);
          }
        });
    }
   
  }

  ///payment code end

  isAccessories(data) {
    if (data == 2) {
      this.senData.isAccessories = "2"
      this.isAccessoriesArea = false
    } else {
      this.senData.isAccessories = "1"
      this.isAccessoriesArea = true
    }

  }

  sendMail() {
    if (this.calculatedValue.kitTotalPrice != 0 && this.calculatedValue.instalationCost != 0 && this.calculatedValue.accessoriesprice != 0) {
      this.mailApi("1");
    } else if (this.calculatedValue.kitTotalPrice != 0 && this.calculatedValue.instalationCost != 0 && this.calculatedValue.accessoriesprice == 0) {
      this.mailApi("4");
    } else if (this.calculatedValue.kitTotalPrice != 0 && this.calculatedValue.instalationCost == 0 && this.calculatedValue.accessoriesprice == 0) {
      this.mailApi("5");
    } else if (this.calculatedValue.kitTotalPrice == 0 && this.calculatedValue.instalationCost == 0 && this.calculatedValue.accessoriesprice != 0) {
      this.mailApi("2");
    } else if (this.calculatedValue.kitTotalPrice != 0 && this.calculatedValue.instalationCost == 0 && this.calculatedValue.accessoriesprice != 0) {
      this.mailApi("3");
    }

  }
  mailApi(type) {
    var sendData: any = { type: type, name: this.senData.name, phone: this.senData.phone, email: this.senData.email, postalCode: this.senData.postalCode, suburb: this.senData.suburb, state: this.senData.state, street: this.senData.street, diyKit: this.calculatedValue.kitTotalPrice, installation: this.calculatedValue.instalationCost, accessories: this.calculatedValue.accessories, deliveryCharge: this.calculatedValue.deliveryCharge, gst: this.calculatedValue.gstTotal, fullTotal: this.calculatedValue.fullTotal, total: this.calculatedValue.total, mesh: this.senData.meshColor, trim: this.senData.trimColor }
    this.app.postService('/email', sendData).then((res) => {
      if (res['error']) {
        this.toastr.error("Something went wrong", 'Error')
      } else {
        this.regData.name = this.senData.name;
        this.regData.email = this.senData.email;
        this.regData.phone = this.senData.phone;
        this.regData.street = this.senData.street;
        this.regData.suburb = this.senData.suburb;
        this.regData.state = this.senData.state;
        this.regData.postalCode = this.senData.postalCode;
        this.regData.type = this.senData.type;
        this.regData.area = this.senData.area;
        this.regData.gutterSize = this.senData.gutterSize;
        this.regData.valleySize = this.senData.valleySize;
        if(this.regData.type == '2'){
          if(this.regData.area == '1'){
             this.regData.Price = Number(this.regData.gutterSize)*8
             console.log("1")
             console.log(this.regData.price)
             this.quoteApi()
          }else if(this.regData.area == '2'){
            this.regData.Price = Number(this.regData.valleySize)*8
            console.log("2")
            console.log(this.regData.price)

            this.quoteApi()
          }else{
             this.regData.Price = (Number(this.regData.gutterSize)*8)+(Number(this.regData.valleySize)*8)
             console.log("3")
             console.log(this.regData.price)

             this.quoteApi()
          }
        }
      }
    }).catch((err) => {
      this.toastr.error("something went wrong", 'Error')
    })
  }
  quoteApi(){
    this.app.postService('/postQuote',this.regData).then(res =>{
      if(res['error']){
        this.toastr.error("Something went wrong", 'Error')

      }else{
        this.toastr.success("Quote send your mail id successfully", "Success")
        this.regData = {}
      }
    })
  }
  onChange(data) {
    console.log(data)
    if (data == 1) {
      this.accScrewColor = true
    } else {
      this.accScrewColor = false
    }
  }
  protection(value) {
    if (value == 1) {
      this.protectionGutter = true
      this.protectionValley = false
    } else if (value == 2) {
      this.protectionGutter = false
      this.protectionValley = true
    } else if (value == 3) {
      this.protectionGutter = true
      this.protectionValley = true
    }
  }
  prevFirstPage() {
    this.firstPage = true;
    this.secondPage = false;
    this.secondPage1 = false;
    this.secondPage2 = false;
    this.secondPage3 = false;
    this.thirdPage = false;
  }
  kliplok() {
    this.senData.area = "1"
    this.protectionArea = false;
    this.protectionValley = false;
    this.protectionGutter = true
  }
  nonkliplok() {
    this.protectionArea = true;
    this.protectionValley = false;
    this.protectionGutter = false;
  }
  partsOnly() {
    this.secondPage1 = false;
    this.secondPage3 = true;
    this.senData.isAccessories = "1"
    this.isAccessoriesOptions = false
    this.isAccessoriesArea = true
  }
  quotePrevious() {
    this.firstPage = false;
    this.secondPage = true;
    this.secondPage1 = false;
    this.secondPage2 = false;
    this.secondPage3 = true;
    this.thirdPage = false;
  }
  sumbitFirstPage() {
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/igm;
    var mobileRegex = /^[0-9]{8,15}[^.]$/
    if (this.senData.name == "" || this.senData.name == undefined) {
      this.toastr.error('Please enter the name', 'Error');
    } else if (this.senData.phone == "" || this.senData.phone == undefined) {
      this.toastr.error('Please enter the phone number', 'Error');
    } else if (!mobileRegex.test(this.senData.phone)) {
      this.toastr.error("Please enter a valid phone number", "Error")
    } else if (this.senData.email == "" || this.senData.email == undefined) {
      this.toastr.error('Please enter the email id', 'Error');
    } else if (!emailRegex.test(this.senData.email)) {
      this.toastr.error("Please enter a valid email id", 'Error')
    } else if (this.senData.postalCode == "" || this.senData.postalCode == undefined) {
      this.toastr.error('Please enter Postal code', 'Error');
    } else if (this.senData.suburb == "" || this.senData.suburb == undefined) {
      this.toastr.error('Please enter Suburb', 'Error');
    } else if (this.senData.state == "" || this.senData.state == undefined) {
      this.toastr.error('Please enter state', 'Error');
    } else if (this.senData.street == "" || this.senData.street == undefined) {
      this.toastr.error('Please enter street', 'Error');
    } else {
      this.senData.postalCode = Number(this.senData.postalCode)
      this.senData.phone = Number(this.senData.phone)
      this.app.postService('/getinstallers',{postalCode:this.senData.postalCode}).then(res=>{
        if(res['error']){
        this.toastr.error(res['message'],"Error")
        }else{
          console.log(res)
        this.installers = res['data']
        }
      })
      this.firstPage = false;
      this.secondPage = true;
      this.secondPage1 = true;
      this.secondPage2 = false;
      this.secondPage3 = false;
      this.thirdPage = false;

    }
    window.scrollTo(0, 0);
  }

  sumbitSecondPage1() {
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/igm;
    var mobileRegex = /^[0-9]{8,15}[^.]$/
    if (this.senData.name == "" || this.senData.name == undefined) {
      this.toastr.error('Please enter the name', 'Error');
    } else if (this.senData.phone == "" || this.senData.phone == undefined) {
      this.toastr.error('Please enter the phone number', 'Error');
    } else if (!mobileRegex.test(this.senData.phone)) {
      this.toastr.error("Please enter a valid phone number", "Error")
    } else if (this.senData.email == "" || this.senData.email == undefined) {
      this.toastr.error('Please enter the email id', 'Error');
    } else if (!emailRegex.test(this.senData.email)) {
      this.toastr.error("Please enter a valid email id", 'Error')
    } else if (this.senData.type == "" || this.senData.type == undefined) {
      this.toastr.error('Please select requirements for our Guttermesh', 'Error');
    } else if (this.senData.product == "" || this.senData.product == undefined) {
      this.toastr.error('Please select the type of roof', 'Error');
    } else if (this.senData.subproduct == "" || this.senData.subproduct == undefined) {
      this.toastr.error('Please select the type of guttermesh ', 'Error');
    } else if (this.senData.area == "" || this.senData.area == undefined) {
      this.toastr.error('Please select gutter area  ', 'Error');
    } else if (this.senData.area == "1") {
      if (this.senData.gutterSize == "" || this.senData.gutterSize == undefined) {
        this.toastr.error('Please enter the gutter size ', 'Error');
      } else if (!(Number(this.senData.gutterSize) % 10 == 0)) {
        this.toastr.error('Please enter the gutter size in multiples of 10', 'Error');
      } else {
        this.senData.gutterSize = Number(this.senData.gutterSize)
        this.sumbitSecondPage1Final()
      }
    } else if (this.senData.area == "2") {
      if (this.senData.valleySize == "" || this.senData.valleySize == undefined) {
        this.toastr.error('Please enter the valley size ', 'Error');
      } else if (!(Number(this.senData.valleySize) % 10 == 0)) {
        this.toastr.error('Please enter the valley size in multiples of 10', 'Error');
      } else {
        this.senData.valleySize = Number(this.senData.valleySize)
        this.sumbitSecondPage1Final()
      }
    } else if (this.senData.area == "3") {
      if (this.senData.gutterSize == "" || this.senData.gutterSize == undefined) {
        this.toastr.error('Please enter the gutter size ', 'Error');
      } else if (!(Number(this.senData.gutterSize) % 10 == 0)) {
        this.toastr.error('Please enter the gutter size in multiples of 10', 'Error');
      } else if (this.senData.valleySize == "" || this.senData.valleySize == undefined) {
        this.toastr.error('Please enter the valley size ', 'Error');
      } else if (!(Number(this.senData.valleySize) % 10 == 0)) {
        this.toastr.error('Please enter the valley size in multiples of 10', 'Error');
      } else {
        this.senData.gutterSize = Number(this.senData.gutterSize)
        this.senData.valleySize = Number(this.senData.valleySize)
        this.sumbitSecondPage1Final()
      }
    }
    window.scrollTo(550, 550);
  }
  sumbitSecondPage1Final() {
    this.senData.postalCode = Number(this.senData.postalCode)
    this.senData.phone = Number(this.senData.phone)
    this.firstPage = false;
    this.secondPage = true;
    this.secondPage1 = false;
    this.secondPage2 = true;
    this.secondPage3 = false;
    this.thirdPage = false;

  }

  onClick(data) {
    this.senData.meshColor = data.name
    this.senData.meshColorCode = data.code
  }
  onClick1(data) {
    this.senData.trimColor = data.name
    this.senData.trimColorCode = data.code
  }

  sumbitSecondPage2() {
    if (this.senData.meshColor == "" || this.senData.meshColor == undefined) {
      this.toastr.error("Please Select the mesh color", "Error")
    } else if (this.senData.trimColor == "" || this.senData.trimColor == undefined) {
      this.toastr.error("Please Select the trim color", "Error")
    } else {
      this.firstPage = false;
      this.secondPage = true;
      this.secondPage1 = false;
      this.secondPage2 = false;
      this.secondPage3 = true;
      this.thirdPage = false;
    }
    window.scrollTo(550, 550);

  }
  applyPromo() {
    this.app.postService('/promo', {code:this.code}).then((res) => {
      if (res['error']) {
        this.toastr.error(res['message'], 'Error')
      } else {
        this.applied = false
        this.removed = true
        this.promoinput = true
        this.percentage = res['data'].percent
        this.calculatedValue.oldtotal = this.calculatedValue.total
        this.offerAmount = (this.calculatedValue.total * this.percentage) / 100
        this.calculatedValue.total = this.calculatedValue.total - this.offerAmount
        if (this.calculatedValue.total > 250) {
          this.calculatedValue.deliveryCharge = 0
        } else {
          this.calculatedValue.deliveryCharge = 70
        }
        this.calculatedValue.gstTotal = (this.calculatedValue.total * 10) / 100
        this.calculatedValue.fullTotal = this.calculatedValue.total + this.calculatedValue.gstTotal + this.calculatedValue.deliveryCharge;
        this.toastr.success("Promo applied successfully", "Success")
      }
    })
  }
  removePromo(){
    this.removed = false;
    this.applied = true;
    this.promoinput = false
    this.calculatedValue.total = this.calculatedValue.total + this.offerAmount
    if (this.calculatedValue.total > 250) {
      this.calculatedValue.deliveryCharge = 0
    } else {
      this.calculatedValue.deliveryCharge = 70
    }
    this.calculatedValue.gstTotal = (this.calculatedValue.total * 10) / 100
    this.calculatedValue.fullTotal = this.calculatedValue.total + this.calculatedValue.gstTotal + this.calculatedValue.deliveryCharge;
    this.code = ""
    this.toastr.success("Promo removed successfully","Success")
  }

  sumbitSecondPage3() {
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/igm;
    var mobileRegex = /^[0-9]{8,15}[^.]$/
    if (this.senData.name == "" || this.senData.name == undefined) {
      this.toastr.error('Please enter the name', 'Error');
    } else if (this.senData.phone == "" || this.senData.phone == undefined) {
      this.toastr.error('Please enter the phone number', 'Error');
    } else if (!mobileRegex.test(this.senData.phone)) {
      this.toastr.error("Please enter a valid phone number", "Error")
    } else if (this.senData.email == "" || this.senData.email == undefined) {
      this.toastr.error('Please enter the email id', 'Error');
    } else if (!emailRegex.test(this.senData.email)) {
      this.toastr.error("Please enter a valid email id", 'Error')
    } else {
      if (this.senData.isAccessories == "1") {
        if (this.senData.aluWidth || this.senData.aluColor || this.senData.aluQuantity) {
          if (this.senData.aluWidth == "" || this.senData.aluWidth == undefined) {
            this.toastr.error("Please select Alumesh width", "Error")
          } else if (this.senData.aluColor == "" || this.senData.aluColor == undefined) {
            this.toastr.error("Please select Alumesh color", "Error")

          } else if (this.senData.aluQuantity == "" || this.senData.aluQuantity == undefined) {
            this.toastr.error("Please enter the Alumesh Quantity", "Error")
          } else if (Number(this.senData.aluQuantity) < 10) {
            this.toastr.error("Please enter the  Alumesh Quantity as more than 10", "Error")
          } else {
            if (this.senData.emberWidth || this.senData.emberColor || this.senData.emberQuantity) {
              if (this.senData.emberWidth == "" || this.senData.emberWidth == undefined) {
                this.toastr.error("Please select Embermesh width", "Error")
              } else if (this.senData.emberColor == "" || this.senData.emberColor == undefined) {
                this.toastr.error("Please select Embermesh color", "Error")
              } else if (this.senData.emberQuantity == "" || this.senData.emberQuantity == undefined) {
                this.toastr.error("Please enter the Embermesh quantity", "Error")
              } else if (Number(this.senData.emberQuantity) < 10) {
                this.toastr.error("Please enter the  Embermesh Quantity as more than 10", "Error")
              } else {
                if (this.senData.plasWidth || this.senData.plasColor || this.senData.plasQuantity) {
                  if (this.senData.plasWidth == "" || this.senData.plasWidth == undefined) {
                    this.toastr.error("Please select Plashmesh width", "Error")
                  } else if (this.senData.plasColor == "" || this.senData.plasColor == undefined) {
                    this.toastr.error("Please select Plashmesh color", "Error")
                  } else if (this.senData.plasQuantity == "" || this.senData.plasQuantity == undefined) {
                    this.toastr.error("Please enter the Plashmesh quantity", "Error")
                  } else if (Number(this.senData.plasQuantity) < 10) {
                    this.toastr.error("Please enter the  Plashmesh Quantity as more than 10", "Error")
                  }
                  else {
                    if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
                      if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                        this.toastr.error("Please enter trim quantity", "Error")
                      } else if (Number(this.senData.accTrimQuantity) < 10) {
                        this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
                      } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                        this.toastr.error("Please select trim color", "Error")
                      } else {
                        if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                          if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                            this.toastr.error("Please select saddles type", "Error")
                          } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                            this.toastr.error("Please enter the saddles  Quantity", "Error")
                          } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                            this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                          }
                          else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                            this.toastr.error("Please enter the saddles  color", "Error")
                          } else {
                            if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                                this.toastr.error("Please select screw type", "Error")
                              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                                this.toastr.error("Please enter the screw  Quantity", "Error")
                              } else if (Number(this.senData.accScrewQuantity) < 10) {
                                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                              }
                              else {
                                if (this.senData.accScrewType == "1") {
                                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                    this.toastr.error("Please select screw color", "Error")
                                  } else {
                                    this.sumbitSecondPage3Final()
                                  }
                                } else {
                                  this.sumbitSecondPage3Final()
                                }
                              }
                            }
                            else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                            this.toastr.error("Please select screw type", "Error")
                          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                            this.toastr.error("Please enter the screw  Quantity", "Error")
                          } else if (Number(this.senData.accScrewQuantity) < 10) {
                            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                          } else {
                            if (this.senData.accScrewType == "1") {
                              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                this.toastr.error("Please select screw color", "Error")
                              } else {
                                this.sumbitSecondPage3Final()
                              }
                            } else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                      if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                        this.toastr.error("Please select saddles type", "Error")
                      } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                        this.toastr.error("Please enter the saddles  Quantity", "Error")
                      } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                        this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                      } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                        this.toastr.error("Please enter the saddles  color", "Error")
                      } else {
                        if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                            this.toastr.error("Please select screw type", "Error")
                          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                            this.toastr.error("Please enter the screw  Quantity", "Error")
                          } else if (Number(this.senData.accScrewQuantity) < 10) {
                            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                          } else {
                            if (this.senData.accScrewType == "1") {
                              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                this.toastr.error("Please select screw color", "Error")
                              } else {
                                this.sumbitSecondPage3Final()
                              }
                            } else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        }
                        else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
                  if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                    this.toastr.error("Please enter trim quantity", "Error")
                  } else if (Number(this.senData.accTrimQuantity) < 10) {
                    this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
                  } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                    this.toastr.error("Please select trim color", "Error")
                  } else {
                    if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                      if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                        this.toastr.error("Please select saddles type", "Error")
                      } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                        this.toastr.error("Please enter the saddles  Quantity", "Error")
                      } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                        this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                      } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                        this.toastr.error("Please enter the saddles  color", "Error")
                      } else {
                        if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                            this.toastr.error("Please select screw type", "Error")
                          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                            this.toastr.error("Please enter the screw  Quantity", "Error")
                          } else if (Number(this.senData.accScrewQuantity) < 10) {
                            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                          } else {
                            if (this.senData.accScrewType == "1") {
                              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                this.toastr.error("Please select screw color", "Error")
                              } else {
                                this.sumbitSecondPage3Final()
                              }
                            } else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        }
                        else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                }
              }
            }
            else if (this.senData.plasWidth || this.senData.plasColor || this.senData.plasQuantity) {
              if (this.senData.plasWidth == "" || this.senData.plasWidth == undefined) {
                this.toastr.error("Please select Plashmesh width", "Error")
              } else if (this.senData.plasColor == "" || this.senData.plasColor == undefined) {
                this.toastr.error("Please select Plashmesh color", "Error")
              } else if (this.senData.plasQuantity == "" || this.senData.plasQuantity == undefined) {
                this.toastr.error("Please select Plashmesh quantity", "Error")
              } else if (Number(this.senData.plasQuantity) < 10) {
                this.toastr.error("Please enter the  Plashmesh Quantity as more than 10", "Error")
              }
              else {
                if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
                  if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                    this.toastr.error("Please enter trim quantity", "Error")
                  } else if (Number(this.senData.accTrimQuantity) < 10) {
                    this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
                  } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                    this.toastr.error("Please select trim color", "Error")
                  } else {
                    if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                      if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                        this.toastr.error("Please select saddles type", "Error")
                      } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                        this.toastr.error("Please enter the saddles  Quantity", "Error")
                      } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                        this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                      } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                        this.toastr.error("Please enter the saddles  color", "Error")
                      } else {
                        if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                            this.toastr.error("Please select screw type", "Error")
                          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                            this.toastr.error("Please enter the screw  Quantity", "Error")
                          } else if (Number(this.senData.accScrewQuantity) < 10) {
                            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                          } else {
                            if (this.senData.accScrewType == "1") {
                              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                this.toastr.error("Please select screw color", "Error")
                              } else {
                                this.sumbitSecondPage3Final()
                              }
                            } else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        }
                        else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            }
            else if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
              if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                this.toastr.error("Please enter trim quantity", "Error")
              } else if (Number(this.senData.accTrimQuantity) < 10) {
                this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
              } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                this.toastr.error("Please select trim color", "Error")
              } else {
                if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
              if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                this.toastr.error("Please select saddles type", "Error")
              } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                this.toastr.error("Please enter the saddles  Quantity", "Error")
              } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
              } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                this.toastr.error("Please enter the saddles  color", "Error")
              } else {
                if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                }
                else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                this.toastr.error("Please select screw type", "Error")
              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                this.toastr.error("Please enter the screw  Quantity", "Error")
              } else if (Number(this.senData.accScrewQuantity) < 10) {
                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
              } else {
                if (this.senData.accScrewType == "1") {
                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                    this.toastr.error("Please select screw color", "Error")
                  } else {
                    this.sumbitSecondPage3Final()
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else {
              this.sumbitSecondPage3Final()
            }
          }
        }
        else if (this.senData.emberWidth || this.senData.emberColor || this.senData.emberQuantity) {
          if (this.senData.emberWidth == "" || this.senData.emberWidth == undefined) {
            this.toastr.error("Please select Embermesh width", "Error")
          } else if (this.senData.emberColor == "" || this.senData.emberColor == undefined) {
            this.toastr.error("Please select Embermesh color", "Error")
          } else if (this.senData.emberQuantity == "" || this.senData.emberQuantity == undefined) {
            this.toastr.error("Please select Embermesh quantity", "Error")
          } else if (Number(this.senData.emberQuantity) < 10) {
            this.toastr.error("Please enter the  Embermesh Quantity as more than 10", "Error")
          } else {
            if (this.senData.plasWidth || this.senData.plasColor || this.senData.plasQuantity) {
              if (this.senData.plasWidth == "" || this.senData.plasWidth == undefined) {
                this.toastr.error("Please select Plashmesh width", "Error")
              } else if (this.senData.plasColor == "" || this.senData.plasColor == undefined) {
                this.toastr.error("Please select Plashmesh color", "Error")
              } else if (this.senData.plasQuantity == "" || this.senData.plasQuantity == undefined) {
                this.toastr.error("Please select Plashmesh quantity", "Error")
              } else if (Number(this.senData.plasQuantity) < 10) {
                this.toastr.error("Please enter the  Plashmesh Quantity as more than 10", "Error")
              } else {
                if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
                  if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                    this.toastr.error("Please enter trim quantity", "Error")
                  } else if (Number(this.senData.accTrimQuantity) < 10) {
                    this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
                  } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                    this.toastr.error("Please select trim color", "Error")
                  } else {
                    if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                      if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                        this.toastr.error("Please select saddles type", "Error")
                      } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                        this.toastr.error("Please enter the saddles  Quantity", "Error")
                      } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                        this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                      } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                        this.toastr.error("Please enter the saddles  color", "Error")
                      } else {
                        if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                            this.toastr.error("Please select screw type", "Error")
                          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                            this.toastr.error("Please enter the screw  Quantity", "Error")
                          } else if (Number(this.senData.accScrewQuantity) < 10) {
                            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                          } else {
                            if (this.senData.accScrewType == "1") {
                              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                                this.toastr.error("Please select screw color", "Error")
                              } else {
                                this.sumbitSecondPage3Final()
                              }
                            } else {
                              this.sumbitSecondPage3Final()
                            }
                          }
                        }
                        else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
              if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                this.toastr.error("Please enter trim quantity", "Error")
              } else if (Number(this.senData.accTrimQuantity) < 10) {
                this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
              } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                this.toastr.error("Please select trim color", "Error")
              } else {
                if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
              if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                this.toastr.error("Please select saddles type", "Error")
              } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                this.toastr.error("Please enter the saddles  Quantity", "Error")
              } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
              } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                this.toastr.error("Please enter the saddles  color", "Error")
              } else {
                if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                }
                else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                this.toastr.error("Please select screw type", "Error")
              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                this.toastr.error("Please enter the screw  Quantity", "Error")
              } else if (Number(this.senData.accScrewQuantity) < 10) {
                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
              } else {
                if (this.senData.accScrewType == "1") {
                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                    this.toastr.error("Please select screw color", "Error")
                  } else {
                    this.sumbitSecondPage3Final()
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else {
              this.sumbitSecondPage3Final()
            }
          }
        }
        else if (this.senData.plasWidth || this.senData.plasColor || this.senData.plasQuantity) {
          if (this.senData.plasWidth == "" || this.senData.plasWidth == undefined) {
            this.toastr.error("Please select Plashmesh width", "Error")
          } else if (this.senData.plasColor == "" || this.senData.plasColor == undefined) {
            this.toastr.error("Please select Plashmesh color", "Error")
          } else if (this.senData.plasQuantity == "" || this.senData.plasQuantity == undefined) {
            this.toastr.error("Please select Plashmesh quantity", "Error")
          } else if (Number(this.senData.plasQuantity) < 10) {
            this.toastr.error("Please enter the  Plashmesh Quantity as more than 10", "Error")
          }
          else {
            if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
              if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
                this.toastr.error("Please enter trim quantity", "Error")
              } else if (Number(this.senData.accTrimQuantity) < 10) {
                this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
              } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
                this.toastr.error("Please select trim color", "Error")
              } else {
                if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
                  if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                    this.toastr.error("Please select saddles type", "Error")
                  } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                    this.toastr.error("Please enter the saddles  Quantity", "Error")
                  } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                    this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
                  } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                    this.toastr.error("Please enter the saddles  color", "Error")
                  } else {
                    if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                      if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                        this.toastr.error("Please select screw type", "Error")
                      } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                        this.toastr.error("Please enter the screw  Quantity", "Error")
                      } else if (Number(this.senData.accScrewQuantity) < 10) {
                        this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                      } else {
                        if (this.senData.accScrewType == "1") {
                          if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                            this.toastr.error("Please select screw color", "Error")
                          } else {
                            this.sumbitSecondPage3Final()
                          }
                        } else {
                          this.sumbitSecondPage3Final()
                        }
                      }
                    }
                    else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
              if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                this.toastr.error("Please select saddles type", "Error")
              } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                this.toastr.error("Please enter the saddles  Quantity", "Error")
              } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
              } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                this.toastr.error("Please enter the saddles  color", "Error")
              } else {
                if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                }
                else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                this.toastr.error("Please select screw type", "Error")
              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                this.toastr.error("Please enter the screw  Quantity", "Error")
              } else if (Number(this.senData.accScrewQuantity) < 10) {
                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
              } else {
                if (this.senData.accScrewType == "1") {
                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                    this.toastr.error("Please select screw color", "Error")
                  } else {
                    this.sumbitSecondPage3Final()
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else {
              this.sumbitSecondPage3Final()
            }
          }
        }
        else if (this.senData.accTrimQuantity || this.senData.accTrimColor) {
          if (this.senData.accTrimQuantity == "" || this.senData.accTrimQuantity == undefined) {
            this.toastr.error("Please enter trim quantity", "Error")
          } else if (Number(this.senData.accTrimQuantity) < 10) {
            this.toastr.error("Please enter the  trim Quantity as more than 10", "Error")
          } else if (this.senData.accTrimColor == "" || this.senData.accTrimColor == undefined) {
            this.toastr.error("Please select trim color", "Error")
          } else {
            if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
              if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
                this.toastr.error("Please select saddles type", "Error")
              } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
                this.toastr.error("Please enter the saddles  Quantity", "Error")
              } else if (Number(this.senData.accSaddlesQuantity) < 10) {
                this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
              } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
                this.toastr.error("Please enter the saddles  color", "Error")
              } else {
                if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
                  if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                    this.toastr.error("Please select screw type", "Error")
                  } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                    this.toastr.error("Please enter the screw  Quantity", "Error")
                  } else if (Number(this.senData.accScrewQuantity) < 10) {
                    this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
                  } else {
                    if (this.senData.accScrewType == "1") {
                      if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                        this.toastr.error("Please select screw color", "Error")
                      } else {
                        this.sumbitSecondPage3Final()
                      }
                    } else {
                      this.sumbitSecondPage3Final()
                    }
                  }
                }
                else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                this.toastr.error("Please select screw type", "Error")
              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                this.toastr.error("Please enter the screw  Quantity", "Error")
              } else if (Number(this.senData.accScrewQuantity) < 10) {
                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
              } else {
                if (this.senData.accScrewType == "1") {
                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                    this.toastr.error("Please select screw color", "Error")
                  } else {
                    this.sumbitSecondPage3Final()
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            } else {
              this.sumbitSecondPage3Final()
            }
          }
        } else if (this.senData.accSaddlesType || this.senData.accSaddlesQuantity || this.senData.accSaddlesColor) {
          if (this.senData.accSaddlesType == "" || this.senData.accSaddlesType == undefined) {
            this.toastr.error("Please select saddles type", "Error")
          } else if (this.senData.accSaddlesQuantity == "" || this.senData.accSaddlesQuantity == undefined) {
            this.toastr.error("Please enter the saddles  Quantity", "Error")
          } else if (Number(this.senData.accSaddlesQuantity) < 10) {
            this.toastr.error("Please enter the  saddles Quantity as more than 10", "Error")
          } else if (this.senData.accSaddlesColor == "" || this.senData.accSaddlesColor == undefined) {
            this.toastr.error("Please enter the saddles  color", "Error")
          } else {
            if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
              if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
                this.toastr.error("Please select screw type", "Error")
              } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
                this.toastr.error("Please enter the screw  Quantity", "Error")
              } else if (Number(this.senData.accScrewQuantity) < 10) {
                this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
              } else {
                if (this.senData.accScrewType == "1") {
                  if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                    this.toastr.error("Please select screw color", "Error")
                  } else {
                    this.sumbitSecondPage3Final()
                  }
                } else {
                  this.sumbitSecondPage3Final()
                }
              }
            }
            else {
              this.sumbitSecondPage3Final()
            }
          }
        } else if (this.senData.accScrewType || this.senData.accScrewQuantity || this.senData.accScrewColor) {
          if (this.senData.accScrewType == "" || this.senData.accScrewType == undefined) {
            this.toastr.error("Please select screw type", "Error")
          } else if (this.senData.accScrewQuantity == "" || this.senData.accScrewQuantity == undefined) {
            this.toastr.error("Please enter the screw  Quantity", "Error")
          } else if (Number(this.senData.accScrewQuantity) < 10) {
            this.toastr.error("Please enter the  screw  Quantity as more than 10", "Error")
          } else {
            if (this.senData.accScrewType == "1") {
              if (this.senData.accScrewColor == "" || this.senData.accScrewColor == undefined) {
                this.toastr.error("Please select screw color", "Error")
              } else {
                this.sumbitSecondPage3Final()
              }
            } else {
              this.sumbitSecondPage3Final()
            }
          }
        }
        else {
          this.toastr.error("Please select any Accessories", "Error")
        }
      } else {
        this.sumbitSecondPage3Final()
      }
    }
    window.scrollTo(0, 0);

  }
  sumbitSecondPage3Final() {
    if (this.isAccessoriesOptions == true) {
      if (this.senData.type == "1") {
        this.calculatedValue.isInstallation = false
        this.kitCalcultion()
      } else {
        this.calculatedValue.isInstallation = true
        if (this.senData.area == 1) {
          if ((this.senData.postalCode >= 2600 && this.senData.postalCode <= 2620) || (this.senData.postalCode >= 2900 && this.senData.postalCode <= 2914)) {
            this.calculatedValue.instalationCost = Number(this.senData.gutterSize) * 30
            this.kitCalcultion()
          } else {
            this.calculatedValue.instalationCost = Number(this.senData.gutterSize) * 20
            this.kitCalcultion()
          }
        } else if (this.senData.area == 2) {
          if ((this.senData.postalCode >= 2600 && this.senData.postalCode <= 2620) || (this.senData.postalCode >= 2900 && this.senData.postalCode <= 2914)) {
            this.calculatedValue.instalationCost = Number(this.senData.valleySize) * 30
            this.kitCalcultion()
          } else {
            this.calculatedValue.instalationCost = Number(this.senData.valleySize) * 20
            this.kitCalcultion()
          }
        } else if (this.senData.area == 3) {
          if ((this.senData.postalCode >= 2600 && this.senData.postalCode <= 2620) || (this.senData.postalCode >= 2900 && this.senData.postalCode <= 2914)) {
            this.calculatedValue.instalationCost = (Number(this.senData.valleySize) * 30) + (Number(this.senData.gutterSize) * 30)
            this.kitCalcultion()
          } else {
            this.calculatedValue.instalationCost = (Number(this.senData.valleySize) * 20) + (Number(this.senData.gutterSize) * 20)
            this.kitCalcultion()
          }
        }
      }
    } else {
      this.accessoriesCalcultion();
    }

  }

  kitCalcultion() {
    this.senData.gutterSize == Number(this.senData.gutterSize)
    this.senData.valleySize == Number(this.senData.valleySize)
    if (this.senData.product == "1") {
      if (this.senData.area == "1") {
        this.kitApiCall("2", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.gutterSize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "2") {
        this.kitApiCall("7", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.valleySize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "3") {
        this.kitApiCall("2", this.senData.subproduct).then((res) => {
          this.kitApiCall("7", this.senData.subproduct).then((res1) => {
            var kitPriceGutter: any = res
            var kitPriceValey: any = res1
            console.log(kitPriceGutter)
            console.log(kitPriceValey)
            this.calculatedValue.kitTotalPrice = (kitPriceValey * this.senData.valleySize) + (kitPriceGutter * this.senData.gutterSize)
            this.accessoriesCalcultion()
          })
        })
      }
    } else if (this.senData.product == "2") {
      if (this.senData.area == "1") {
        this.kitApiCall("1", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.gutterSize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "2") {
        this.kitApiCall("6", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.valleySize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "3") {
        this.kitApiCall("1", this.senData.subproduct).then((res) => {
          this.kitApiCall("6", this.senData.subproduct).then((res1) => {
            var kitPriceGutter: any = res
            var kitPriceValey: any = res1
            this.calculatedValue.kitTotalPrice = (kitPriceValey * this.senData.valleySize) + (kitPriceGutter * this.senData.gutterSize)
            this.accessoriesCalcultion()
          })
        })
      }
    } else if (this.senData.product == "3") {
      if (this.senData.area == "1") {
        this.kitApiCall("3", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.gutterSize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "2") {
        this.kitApiCall("8", this.senData.subproduct).then((res) => {
          var kitPrice: any = res
          this.calculatedValue.kitTotalPrice = kitPrice * this.senData.valleySize
          this.accessoriesCalcultion()
        })
      } else if (this.senData.area == "3") {
        this.kitApiCall("3", this.senData.subproduct).then((res) => {
          this.kitApiCall("8", this.senData.subproduct).then((res1) => {
            var kitPriceGutter: any = res
            var kitPriceValey: any = res1
            this.calculatedValue.kitTotalPrice = (kitPriceValey * this.senData.valleySize) + (kitPriceGutter * this.senData.gutterSize)
            this.accessoriesCalcultion()
          })
        })
      }
    } else if (this.senData.product == "4") {
      this.kitApiCall("4", this.senData.subproduct).then((res) => {
        var kitPrice: any = res
        this.calculatedValue.kitTotalPrice = kitPrice * this.senData.gutterSize
        this.accessoriesCalcultion()
      })
    }
  }

  accessoriesCalcultion() {
    if (this.senData.isAccessories == 2) {
      this.finalQuotePage()
    } else {
      if (this.senData.aluQuantity) {
        this.meshApiCall("1", this.senData.aluWidth).then((res) => {
          var meshPrice: any = res
          this.calculatedValue.accessories = meshPrice * this.senData.aluQuantity
          this.finalQuotePage();
        })
      }
      if (this.senData.emberQuantity) {
        this.meshApiCall("2", this.senData.emberWidth).then((res) => {
          var meshPrice: any = res
          this.calculatedValue.accessories = this.calculatedValue.accessories + (meshPrice * this.senData.emberQuantity)
          this.finalQuotePage();
        })

      }
      if (this.senData.plasQuantity) {
        this.meshApiCall("3", this.senData.plasWidth).then((res) => {
          var meshPrice: any = res
          this.calculatedValue.accessories = this.calculatedValue.accessories + (meshPrice * this.senData.plasWidth)
          this.finalQuotePage();
        })
      }
      if (this.senData.accSaddlesQuantity) {
        if (this.senData.accSaddlesType == "1") {
          var accprice: any = this.accessoriesApiCall("1")
          this.accessoriesApiCall("1").then((res) => {
            var accprice: any = res
            this.calculatedValue.accessories = this.calculatedValue.accessories + (accprice * this.senData.accSaddlesQuantity)
            this.finalQuotePage();
          })
        } else {
          this.accessoriesApiCall("2").then((res) => {
            var accprice: any = res
            this.calculatedValue.accessories = this.calculatedValue.accessories + (accprice * this.senData.accSaddlesQuantity)
          })
        }
      }
      if (this.senData.accTrimQuantity) {
        this.accessoriesApiCall("3").then((res) => {
          var accprice: any = res
          this.calculatedValue.accessories = this.calculatedValue.accessories + (accprice * this.senData.accTrimQuantity)
          this.finalQuotePage();
        })
      }
      if (this.senData.accScrewQuantity) {
        if (this.senData.accScrewType == "1") {
          this.accessoriesApiCall("5").then((res) => {
            var accprice: any = res
            this.calculatedValue.accessories = this.calculatedValue.accessories + (accprice * this.senData.accScrewQuantity)
            this.finalQuotePage();
          })
        } else {
          this.accessoriesApiCall("4").then((res) => {
            var accprice: any = res
            this.calculatedValue.accessories = this.calculatedValue.accessories + (accprice * this.senData.accScrewQuantity)
            this.finalQuotePage();
          })
        }

      }

    }

  }

  finalQuotePage() {
    this.calculatedValue.total = this.calculatedValue.instalationCost + this.calculatedValue.kitTotalPrice + this.calculatedValue.accessories;
    console.log(this.calculatedValue.accessories)
    console.log(this.calculatedValue.total)
    if (this.calculatedValue.total > 250) {
      this.calculatedValue.deliveryCharge = 0
    } else {
      this.calculatedValue.deliveryCharge = 70
    }
    this.calculatedValue.gstTotal = (this.calculatedValue.total * 10) / 100
    this.calculatedValue.fullTotal = this.calculatedValue.total + this.calculatedValue.gstTotal + this.calculatedValue.deliveryCharge;
   //fot promo
    this.removed = false;
    this.applied = true;
    this.promoinput = false
    this.code = ""
    //
    this.firstPage = false;
    this.secondPage = false;
    this.secondPage1 = false;
    this.secondPage2 = false;
    this.secondPage3 = false;
    this.thirdPage = true;

  }


  async meshApiCall(mesh, width) {
    return new Promise(async (resolve, reject) => {
      var data = { mesh: mesh, width: width }
      this.app.postService('/meshprice', data).then((res) => {
        if (res['error']) {
          this.toastr.error(res['message'], 'Error')
        } else {
          resolve(res['data'])
        }
      }).catch((err) => {
        this.toastr.error("Something went wrong", "Error")
      })
    })

  }

  async accessoriesApiCall(item) {
    return new Promise(async (resolve, reject) => {
      var data = { item: item }
      this.app.postService('/accessoriesprice', data).then((res) => {
        if (res['error']) {
          this.toastr.error(res['message'], 'Error')
        } else {
          resolve(res['data'])
        }
      }).catch((err) => {
        this.toastr.error("Something went wrong", "Error")
      })
    })

  }



  async kitApiCall(kitType, mesh) {
    return new Promise(async (resolve, reject) => {
      var data = { kitType: kitType, mesh: mesh }
      this.app.postService('/kitsprice', data).then((res) => {
        if (res['error']) {
          this.toastr.error(res['message'], 'Error')
        } else {
          resolve(res['data'])
        }
      }).catch((err) => {
        this.toastr.error("Something went wrong", "Error")
      })
    })

  }
}

