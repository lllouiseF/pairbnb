import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
private _places = new BehaviorSubject<Place[]>([
  
    new Place(
      'p1', 'THE PENINSULA MANILA', 
    'Located in the heart of Makati', 
    'https://pix6.agoda.net/hotelImages/5665043/0/0e2d2a4a94b36e28cd5514522da7b46d.jpg?s=1024x768', 
    45,
    new Date('2021-03-21'),
    new Date('2025-12-31'),
    'abc'
    ),

    new Place(
      'p2', 'Okada Manila', 
    'Manila grand icon', 
    'https://pix6.agoda.net/hotelImages/1622220/-1/028d55deaf69952582fe7a0ba6eae7a6.jpg?s=1024x768',
    41,
    new Date('2021-03-21'),
    new Date('2025-12-31'),
    'abc'
    ),

    new Place(
      'p3', 'Nobu Hotel Manila', 
    'Part of the City of Dreams Casino Resort Complex', 
    'https://www.fivestaralliance.com/files/fivestaralliance.com/field/image/nodes/2016/25083/25083_0_nobuhotelmanila_fsa-g.jpg',
    44,
    new Date('2021-03-21'),
    new Date('2025-12-31'),
    'abc'
    ),
    new Place(
      'p4', 'Tmark Grand Hotel Myeongdong', 
    'Cool Place', 
    'https://www.kayak.com/rimg/himg/82/b8/d6/revato-1216301-12072004-060906.jpg?width=968&height=607&xhint=682&yhint=1474&crop=true&caller=HotelBigCarousel&watermarkheight=16&watermarkpadding=10',
    44,
    new Date('2021-03-21'),
    new Date('2025-12-31'),
    'abc'
    ),
    new Place(
      'p5', 'Tmark Grand Hotel Myeongdong', 
    'Cool Place', 
    'https://i.pinimg.com/564x/50/70/c6/5070c61fcf66c3fab3a00f03d2307e67.jpg',
    44,
    new Date('2021-03-21'),
    new Date('2025-12-31'),
    'abc'
    ),
   
    ]);

get places() {
  return this._places.asObservable();
}
  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(
      take(1), 
      map(places => {
      return {...places.find( p => p.id === id)};
    })
    );
    }

  addPlace(
    title: string, 
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date) 
    {
      const newPlace = new Place(Math.random().toString(), 
      title,
      description, 
      'https://content.r9cdn.net/himg/75/61/89/revato-2376-49088-690820.jpg',
      price,
       dateFrom,
        dateTo, 
        this.authService.userId);

      return  this.places.pipe(take(1), delay(1000), tap(places => {    //tap delay
            this._places.next(places.concat(newPlace));
       
      }));
     
    }
    //edit place information
updatePlace(placeId: string, title: string, desctiption: string){
  return this.places.pipe(take(1), delay(1000), tap(places => {
const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
const updatedPlaces = [...places];
const oldPlace = updatedPlaces[updatedPlaceIndex];
updatedPlaces[updatedPlaceIndex] = new Place(
  oldPlace.id, 
  title, 
  desctiption, 
  oldPlace.imageUrl,
  oldPlace.price,
  oldPlace.availableFrom,
  oldPlace.availableTo,
  oldPlace.userId
  );
  this._places.next(updatedPlaces);
  })
  );
}
}
