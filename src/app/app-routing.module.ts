import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GutterguardKitOrderComponent } from './gutterguard-kit-order/gutterguard-kit-order.component';
import { OrderContactInfoComponent } from './order-contact-info/order-contact-info.component';
import { FooterComponent } from './footer/footer.component'
import { EmailpayComponent } from './emailpay/emailpay.component';

const routes: Routes = [
{ path: '', redirectTo: 'gutter', pathMatch: 'full' },
{path:'navbar', component:NavbarComponent},
{path:'footer', component:FooterComponent},
{path:'gutter', component:GutterguardKitOrderComponent},
{path:'order', component:OrderContactInfoComponent},
{path:'emailpay', component:EmailpayComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
