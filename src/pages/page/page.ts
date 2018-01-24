import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import {Http} from "@angular/http";
import {ApiQuery} from "../../library/api-query";
/**
 * Generated class for the Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page',
  templateUrl: 'page.html',
})
export class Page {

  page: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery,
      public http: Http
  ) {
    this.api.showLoad();
    this.http.get(this.api.url + '/page/' + this.navParams.get('pageId'), this.api.setHeaders(false)).subscribe(
        data => {
          //alert(JSON.stringify(data));
          console.log('page: ', data.json());
          this.page = data.json();
          this.api.hideLoad();
          $('#content').html(this.page.content);
          //this.content.scrollToTop(300);
        }, err => {
          console.log('register: ', err);
          this.page = {
            title: 'Page Error',
            content: err._body
          };
          $('#content').html(this.page.content);
          this.api.hideLoad();
        }
    );
  }

  ionViewWillEnter() {
    this.api.activePageName = 'Page';
    $('#back').show();
    $('#logout,#register').hide();
    $('#contact').hide();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

}
