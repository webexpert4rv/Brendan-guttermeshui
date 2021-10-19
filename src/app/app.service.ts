import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class AppService {
// baseurl = "http://18.225.25.41:4001"
//  baseurl = "http://localhost:4001"
   baseurl = "http://3.104.225.199:4002/api"
   
  //baseurl = "https://quote.guttermeshdirect.com.au:3100"
  
  constructor(private http: HttpClient) {
  }
  async postService(url, data) {
    return new Promise(async (resolve, reject) => {
      var token = await localStorage.getItem('token')
      let option = new HttpHeaders({ 'Content-Type': 'application/json','access-token':(token != null ? token: '')})
      this.http.post(this.baseurl + url, data,{headers:option}).subscribe(res => { resolve(res) },
        err => { reject(err) }
      )
    })
  }

 async  getService(url) {
    return new Promise(async (resolve, reject) => {
      var token = await localStorage.getItem('token')
      let option = new HttpHeaders({ 'Content-Type': 'application/json','access-token':(token != null ? token: '')})
      this.http.get(this.baseurl + url,{headers:option}).subscribe(res => { resolve(res) },
        err => { reject(err) }
      )
    })
  }
}
