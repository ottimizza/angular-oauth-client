import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { logging } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name;

  public localhost = false;

  public ottimizzaAuthServerDetails = {
    url: this.localhost ? 'http://localhost:9092' : 'https://development-oauth-server.herokuapp.com', // oauth/authorize
    clientId: 'ottimizza',
    redirectUri: `${window.location}?app=ottimizza`
  };

  constructor(@Inject(DOCUMENT) private document: Document, public route: ActivatedRoute) {
  }

  public GITHUB_URL = 'https://github.com/login/oauth/authorize';

  /**
   * 
   */
  public ottimizza(responseType: string): void {
    const that = this;

    const baseUrl = `${that.ottimizzaAuthServerDetails.url}/oauth/authorize`;
    const clientId = `${that.ottimizzaAuthServerDetails.clientId}`;
    const redirectUri = `${that.ottimizzaAuthServerDetails.redirectUri}`;
    const state = that.genState();

    that.writeCookieState(state, true).then(() => {
      // &state=${state}
      const url = `${baseUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}`;
      this.document.location.href = url;
    });
  }

  public login(responseType: string = 'code') {
    this.ottimizza(responseType);
  }

  private writeCookieState(state: string, googleAuth: boolean): Promise<{}> {
    return new Promise((resolve) => {
      // Note here the specific domain beginning with a point
      // That’s one of the key in order to be able to read the cookie from the subdomain
      const baseDomain = '.ottimizza.com';
      let expireAfter: Date = new Date(); // moment(new Date()).add(5, 'm').toDate();
      expireAfter.setMonth(expireAfter.getMonth() + 5);

      const ostate = { state, googleAuth };
      const expires = expireAfter;

      const cookie = `Our_state=${JSON.stringify(ostate)}; expires="${expireAfter}"; domain="${baseDomain}"; path="/"`;

      alert(cookie);


      this.document.cookie = cookie;
      // 'Our_state={"state":"' + state + '", "googleAuth": ' + googleAuth + '};
      // expires=' + expireAfter + '; domain=' + baseDomain + '; path=/’;

      resolve();
    });

  }

  genState() {
    let state = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
  }

  public ngOnInit() {
    this.name = this.route.snapshot.queryParamMap.get("paramName")
    this.route.queryParamMap.subscribe(queryParams => {
      console.log(queryParams);

      this.name = queryParams.get("paramName")
    });
  }

}
