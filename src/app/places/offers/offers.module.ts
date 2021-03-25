import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { Routes } from '@angular/router';

const routes: Routes = [
{
  path: '',
  component: OffersPage
}
]


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersPageRoutingModule
  ],
  declarations: [OffersPage, OfferItemComponent]
})
export class OffersPageModule {}
