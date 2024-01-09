import { Injectable, Inject, PLATFORM_ID, StateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { Component } from '@angular/core';

type AnyToObservableFunction = (...args: any[]) => Observable<any>;

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private serverUrl: string;
  private port: number;
  private url: string;

  static db_put_key = makeStateKey<any>('db-put');
  static db_get_key = makeStateKey<any>('db-get');
  static greet_key = makeStateKey<any>('greet');

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize serverUrl and port from environment variables
    this.serverUrl = environment.apiServerUrl || 'localhost';
    this.port = environment.apiServerPort || 3000;
    this.url = `http://${this.serverUrl}:${this.port}`
  }

  private buildUrl(endpoint: string): string {
    // Construct the full URL using the serverUrl, port, and endpoint
    return `${this.url}/${endpoint}`;
  }

  private APICall(func: AnyToObservableFunction, dataKey: StateKey<any>): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      // If on the server, use HttpClient directly
      console.log("APICall on server.");
      return func();
    } else {
      const storedData = this.transferState.get<any>(dataKey, null);

      if (storedData) {
        console.log("APICall on client with storedData.");
        this.transferState.remove(dataKey);
        return new Observable<any>(storedData);
      } else {
        console.log("APICall on client without storedData.");
        return func();
      }
    }
  }

  addCard(data: Record<string, any>): Observable<any> {
    let put = (): Observable<any> => {
      const url = this.buildUrl("mongodb-data");
      return this.http.post(url, data);
    };
    return this.APICall(put, BackendService.db_put_key);
  }

  retrieveCard(): Observable<any> {
    let get = (): Observable<any> => {
      const url = this.buildUrl("mongodb-data");
      return this.http.get(url);
    };
    return this.APICall(get, BackendService.db_get_key);
  }

  greeting(): Observable<any> {
    let get = (): Observable<any> => {
      const url = this.buildUrl("hello");
      return this.http.get(url);
    };
    return this.APICall(get, BackendService.greet_key);
  }
}
