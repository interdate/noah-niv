import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";

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
  email: any = '';
  subject: any = '';
  body: any = '';
  text: any;
  errors: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery
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
      if(this.subject.length < 3 || this.body.length < 3 || (!this.login && this.email.length < 3)){
          this.errors = 'נא למלא את כל השדות';
      }else{

          this.api.showLoad();
          var data = {
              email: (this.login) ? '' : this.email,
              subject: this.subject,
              body: this.body
          };
          var header = this.api.setHeaders((this.login) ? true : false);
          this.api.http.post(this.api.url + '/contactUs', data, header).subscribe(
              (data: any) => {
                  //alert(JSON.stringify(data));
                  console.log('contact: ', data);
                  if (data.send == true) {
                      this.text = data.text;
                      this.subject = this.body = this.email = '';
                  } else {
                      this.errors = data.text;
                  }
                  this.api.hideLoad();
              }, err => {
                  console.log('login: ', err);
                  //this.api.storage.remove('status');
                  this.errors = (typeof err.error != 'undefined') ? err.error : err._body;
                  this.api.hideLoad();
              }
          );
      }
  }

}
