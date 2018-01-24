import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from '../../library/api-query';
import {Http, Headers, RequestOptions} from '@angular/http';
import {HomePage} from "../home/home";
import {RecoveryPage} from "../recovery/recovery";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {RegisterPage} from "../register/register";
//import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    email: any;
    password: any;
    header: any;
    errors: any;
    fbId: any = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http,
        private fb: Facebook,
        public alertCtrl: AlertController
    ) {
        this.fb.browserInit(254264305104909);
        api.storage.get('username').then((val) => {
            this.email = val;
        });
    }

    loginFB(){
        this.fb.getLoginStatus().then((
            res: FacebookLoginResponse) => {
                console.log('Logged into Facebook!', res);
                if(res.status == 'connected'){
                    this.getFBData(res)
                }else{
                    this.fb.login(['email','public_profile']).then((
                        res: FacebookLoginResponse) => {
                            console.log('Logged into Facebook!', res);
                            this.getFBData(res)
                        }).catch(e => console.log('Error logging into Facebook', e));
                }
            }).catch(e => console.log('Error logging into Facebook', e));
    }

    getFBData(status){
        this.fb.api("/me?fields=email,first_name,last_name,gender,picture,id", ['email','public_profile']).then(
            res => {
                this.checkBFData(res);
            }).catch(e => console.log('Error getData into Facebook', e));
    }

    checkBFData(fbData){
        console.log('DaTA user', fbData);
        //alert(JSON.stringify(fbData));
        this.http.post(this.api.url + '/user/login/fb/' + fbData.id, '', this.setHeaders()).subscribe(data => {
            //alert(JSON.stringify(data));

            console.log('login: ', data.json());
            if(data.json().user.login == '1'){
                this.api.storage.set('username', data.json().user.email);
                this.api.storage.set('password', data.json().user.password);
                this.api.storage.set('status', 'login');
                this.api.storage.set('user_id', data.json().user.userId);
                this.api.storage.set('user_photo', data.json().user.photo);

                this.api.setHeaders(true, data.json().user.email, data.json().user.password);
                this.navCtrl.push(HomePage);

                this.api.storage.get('deviceToken').then((deviceToken) => {
                    this.api.sendPhoneId(deviceToken);
                });
            }else{

                //{"id":"1817225676","birthday":"03/13/1985","education":[{"school":{"id":"111677238850378","name":"IDC Herzliya"},"type":"College","year":{"id":"120960561375312","name":"2013"}}],"email":"meirs890@gmail.com","first_name":"Meir","gender":"male","last_name":"Shely","link":"https://www.facebook.com/meir.shely","locale":"en_US","name":"Meir Shely","timezone":3,"updated_time":"2014-06-16T08:53:08+0000","username":"meir.shely","verified":true,"picture":{"data":{"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/p480x480/224068_3452253644556_1453814060_n.jpg","width":480,"height":480,"is_silhouette":false}},"siteData":{"siteId":-1},"ui":-1}
                let birthdayArr = (fbData.birthday) ? fbData.birthday.split("/") : [];
                let alertPop = this.alertCtrl.create({
                    title: 'כניסה דרך פייסבוק',
                    message: 'האם אתה מעוניין להיכנס עם חשבון קיים או לפתוח חשבון חדש באמצעות פייסבוק?',
                    buttons: [
                        {
                            text: 'פתיחת חשבון חדש',
                            handler: () => {
                                this.navCtrl.push(RegisterPage, {
                                    user:
                                        {
                                            step:0,
                                            userfName: fbData.first_name,
                                            userlName: fbData.last_name,
                                            userGender: (fbData.gender == 'female' ? 0 : 1),
                                            fb_photo: fbData.picture.data.url,
                                            userBirthday_y: (birthdayArr.length == 3) ? birthdayArr[2] : '',
                                            userBirthday_m: (birthdayArr.length == 3) ? birthdayArr[0] : '',
                                            userBirthday_d: (birthdayArr.length == 3) ? birthdayArr[1] : '',
                                            facebook_id: fbData.id
                                        }
                                });

                            }
                        },
                        {
                            text: 'כניסה עם חשבון קיים',
                            role: 'cancel',
                            handler: () => {
                                this.fbId = fbData.id;
                                //alert(this.fbId);
                            }
                        }
                    ]
                });
                alertPop.present();
            }
        }, err => {
            console.log('login: ', err);
        });
    }

    goToRecovery() {
        this.navCtrl.push(RecoveryPage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    ionViewWillEnter() {
        this.api.activePageName = 'LoginPage';
        $('#register,#contact').show();
        $('#back,#logout').hide();
        $('.header').addClass('not-login');
        //alert($('.header').height());
        setTimeout(function () {
            $('.fixed-content,.scroll-content').css({'margin-top': $('.header').innerHeight() + 'px'});
        },10);

    }

    login() {

        let username = this.email;
        let password = this.password;

        if (username == "") {
            username = "nologin";
        }

        if (password == "") {
            password = "nopassword";
        }

        this.api.showLoad();
        //alert(this.fbId);
        this.http.get(this.api.url + '/user/login/' + this.fbId, this.setHeaders()).subscribe(data => {
            //alert(JSON.stringify(data));
            console.log('login: ', data.json());
            this.validate(data.json());
            this.api.hideLoad();
        }, err => {
            console.log('login: ', err);
            this.api.storage.remove('status');
            this.errors = err._body;
            this.api.hideLoad();
        });
    }


    setHeaders() {

        let myHeaders: Headers = new Headers;
        myHeaders.append('Content-type', 'application/json');
        myHeaders.append('Accept', '*/*');
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append("Authorization", "Basic " + btoa(this.email + ':' + this.password));
        myHeaders.append("appVersion", this.api.version);
        this.header = new RequestOptions({
            headers: myHeaders
        });
        return this.header;
    }

    validate(response) {

        if (response.userId) {

            this.api.storage.set('username', this.email);
            this.api.storage.set('password', this.password);
            this.api.storage.set('status', 'login');
            this.api.storage.set('user_id', response.userId);
            this.api.storage.set('user_photo', response.photo);

            this.api.setHeaders(true, this.email, this.password);
            this.navCtrl.push(HomePage);
            // this.navCtrl.push(HomePage, {
            //   params: 'login',
            //   username: this.email,
            //   password: this.password
            // });

            this.api.storage.get('deviceToken').then((deviceToken) => {
                this.api.sendPhoneId(deviceToken);
            });
        }
    }

}
