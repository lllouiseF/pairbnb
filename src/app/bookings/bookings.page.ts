import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
  this.loadedBookings = bookings;
 

  });
  }
onCancelBooking (bookingId: string, slidingEl: IonItemSliding) {
  slidingEl.close();
  this.loadingCtrl.create({message: 'Cancelling your Booking'})
  .then(loadingEl => {
    loadingEl.present();
    this.bookingService.cancelBooking(bookingId).subscribe(() => {
      loadingEl.dismiss();
    });

  })
}


ngOnDestroy(){
if(this.bookingSub) {
this.bookingSub.unsubscribe();
}
}
}