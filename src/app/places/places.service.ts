import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';



interface PlaceData{
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title:string;
  userId: string;
  location: PlaceLocation;
}
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
private _places = new BehaviorSubject<Place[]>([]);

get places() {
  return this._places.asObservable();
}
  constructor(private authService: AuthService, private http: HttpClient) { }

fetchPlaces(){
  return this.http
  .get<{[key: string]: PlaceData}>('https://ionic-angular-app-f437c-default-rtdb.firebaseio.com/offered-places.json')
  .pipe(map(resData => {
    const places  = [];
    for (const key in resData){
      if (resData.hasOwnProperty(key)){
        places.push(
          new Place(
            key,
            resData[key].title,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].price,
            new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo),
            resData[key].userId,
            resData[key].location
          )
        );
      }
    }  
  return places;
    // return [];
  }),
  tap(places => {
    this._places.next(places);
  })
  );
}

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-app-f437c-default-rtdb.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(placeData => {
        console.log(placeData)
        return new Place(id, 
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
          );
      })
    );
    }

  addPlace(
    title: string, 
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation
    ) 
    {
      let generatedId: string;
      let newPlace: Place;
      return this.authService.userId.pipe(take(1),switchMap(userId => {
        if(!userId) {
          throw new Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(), 
      title,
      description, 
      'https://pix6.agoda.net/hotelImages/1622220/-1/028d55deaf69952582fe7a0ba6eae7a6.jpg?s=1024x768',
      price,
       dateFrom,
        dateTo, 
        userId,
        location
        );

       return this.http.post<{name: string}>(
         'https://ionic-angular-app-f437c-default-rtdb.firebaseio.com/offered-places.json',
          { ...newPlace, id: null}) }),switchMap(resData => {
            generatedId = resData.name;
            return this.places;
          }),
          take(1),
          tap(places => {
            newPlace.id = generatedId;
            this._places.next(places.concat(newPlace));
          })
        );

      // return  this.places.pipe(take(1), delay(1000), tap(places => {    
      //       this._places.next(places.concat(newPlace));
       
      // }));
     
    }
    //edit place information
updatePlace(placeId: string, title: string, description: string){
  let updatedPlaces: Place[];
 return this.places.pipe(take(1), switchMap(places => {
   if (!places || places.length <= 0){
     return this.fetchPlaces();
   }else {
     return of(places);
   }
 
  }),
  switchMap(places => {
    const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
    updatedPlaces = [...places];
    const oldPlace = updatedPlaces[updatedPlaceIndex];
    updatedPlaces[updatedPlaceIndex] = new Place(
      oldPlace.id, 
      title, 
      description, 
      oldPlace.imageUrl,
      oldPlace.price,
      oldPlace.availableFrom,
      oldPlace.availableTo,
      oldPlace.userId,
      oldPlace.location
      );
    return this.http.put(
      `https://ionic-angular-app-f437c-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
      {...updatedPlaces[updatedPlaceIndex], id: null}
      );
  }), tap(() => {
    this._places.next(updatedPlaces);
  })
  );
}
}


