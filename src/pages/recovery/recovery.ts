import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from '../../library/api-query';
import {Http} from "@angular/http";



@Component({
    selector: 'page-recovery',
    templateUrl: 'recovery.html',
})
export class RecoveryPage {

    email: any;
    errors: any;
    text: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http
    ) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecoveryPage');
    }

    ionViewWillEnter() {
        this.api.activePageName = 'RecoveryPage';
        $('#register,#back').show();
        $('#logout,#contact').hide();
        $('.header').addClass('not-login');
        setTimeout(function () {
            $('.fixed-content,.scroll-content').css({'margin-top': $('.header').innerHeight() + 'px'});
        },10);
    }

    recoveryPassword(){
        this.errors = '';
        this.text = '';
        this.api.showLoad();

        this.http.get(this.api.url + '/recovery/' + this.email, {}).subscribe(
            data => {
                //alert(JSON.stringify(data));
                console.log('recovery: ', data.json());
                if(data.json().err == true){
                    this.errors = data.json().text;
                }else{
                    this.text = data.json().text;
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
