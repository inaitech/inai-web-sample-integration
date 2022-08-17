import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  initializeInai () {
    window.inai.initialize({
      token: 'sbx_ci_4iUs94x9BEgdtwd3JVP9gVmSpqFBwo4uAUCJk1BRfcmb',
      orderId: 'sbx_ord_2DRYKIP9Cq612F0fEn4yGeQhnWx',
      countryCode: 'IND',
      redirectUrl: '',
      locale: ''
    });
  }
}
