import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {Http} from "@angular/http";

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  login: any = false;
  email: any;
  subject: any;
  body: any;
  text: any;
  errors: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery,
      public http: Http
  ) {

    api.storage.get('status').then((val) => {
      this.login = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  ionViewWillEnter() {
    this.api.activePageName = 'ContactPage';
    $('#back').show();
    $('#logout,#contact').hide();
    if(this.login == 'login'){
      $('#register').hide();
      $('.header').removeClass('not-login');
    }else{
      $('#register').show();
      $('.header').addClass('not-login');
    }
    setTimeout(function () {
      $('.fixed-content,.scroll-content').css({'margin-top': $('.header').innerHeight() + 'px'});
    },10);

  }

  sendContact(){
    this.errors = '';
    this.text = '';
    this.api.showLoad();
    var data = {
      email: (this.login) ? '' : this.email,
      subject: this.subject,
      body: this.body
    };
    var header = this.api.setHeaders((this.login) ? true : false);
    this.http.post(this.api.url + '/contactUs', data, header).subscribe(
        data => {
          //alert(JSON.stringify(data));
          console.log('contact: ', data.json());
          if(data.json().send == true){
            this.text = data.json().text;
          }else{
            this.errors = data.json().text;
          }
          this.api.hideLoad();
        }, err => {
          console.log('login: ', err);
          //this.api.storage.remove('status');
          this.errors = err._body;
          this.api.hideLoad();
        }
    );
  }

}
