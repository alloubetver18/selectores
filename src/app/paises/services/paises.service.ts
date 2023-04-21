import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paises, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v2';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code,name`;

    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(alpha: string): Observable<Paises | null> {
    if (alpha.length == 0) {
      return of();
    }
    const url: string = `${this._baseUrl}/alpha/${alpha}`;
    return this.http.get<Paises>(url);
  }

  getPaisPorCodigoSmall(alpha: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${alpha}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
}
