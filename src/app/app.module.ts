import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{FormsModule,ReactiveFormsModule} from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GutterguardKitOrderComponent } from './gutterguard-kit-order/gutterguard-kit-order.component';
import { OrderContactInfoComponent } from './order-contact-info/order-contact-info.component';
import { FooterComponent } from './footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { NgxStripeModule } from 'ngx-stripe';
import { EmailpayComponent } from './emailpay/emailpay.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GutterguardKitOrderComponent,
    OrderContactInfoComponent,
    FooterComponent,
    EmailpayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NgxStripeModule.forRoot('pk_live_N6nkMIiEyBBAXyLGIZuqFan800acFTacaZ'),
    ToastrModule.forRoot() // ToastrModule added

  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
