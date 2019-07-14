import { Component, ViewChild } from '@angular/core';
import { Platform, ViewController, Nav, Content } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {ApiQuery} from '../library/api-query';
import * as $ from "jquery";
import {LoginPage} from "../pages/login/login";
import {ContactPage} from "../pages/contact/contact"
import {RegisterPage} from "../pages/register/register";
import {NotificationPage} from "../pages/notification/notification";
import {ChatPage} from "../pages/chat/chat";
import {InboxPage} from "../pages/inbox/inbox";
import {InvitationsPage} from "../pages/invitations/invitations";
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    @ViewChild(ViewController) viewCtrl: ViewController;
    @ViewChild(Content) content: Content;
    rootPage:any;
    public pushObj: PushObject;
    pageGo: any;
    bingo: any;
    status: any = 'logout';
    counters: any;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public api: ApiQuery,
        public push: Push,
    ) {
        splashScreen.show();
        api.storage.get('status').then((val) => {
            //this.initPushNotification();
            //alert(val);
            if (!val) {
                this.rootPage = LoginPage;
                this.status = 'logout';
            } else {
                //this.menu_items = this.menu_items_login;
                //this.getBingo();
                this.rootPage = HomePage;
                this.status = 'login';
            }
        });
        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need
            this.statusBar.styleDefault();
            if (this.splashScreen)
            {
                var that = this;
                setTimeout(() => {
                    that.splashScreen.hide();
                }, 100);
            }
            //this.splashScreen.hide();
            this.initPushNotification();
        });
        //this.showTest();
        this.getCounters();
        this.getBingo();

    }

    initPushNotification(){
        if (!this.platform.is('cordova')) {
            console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
            return;
        }
        const options: PushOptions = {
            android: {
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        this.pushObj = this.push.init(options);

        this.pushObj.on('registration').subscribe( (data: any) => {
            //this.deviceToken = data.registrationId;
            this.api.storage.set('deviceToken', data.registrationId);
            console.log("device token ->", data.registrationId);
            this.api.sendPhoneId(data.registrationId);
            //alert(data.registrationId);
            //TODO - send device token to server
        });

        this.pushObj.on('notification').subscribe( (data: any) => {
            console.log("PUSH NOTIFICATION: " + JSON.stringify(data));
            //if user using app and push notification comes
            if (data.additionalData.foreground == false) {
                this.api.storage.get('user_id').then((val) => {
                    if (val) {
                        this.nav.push(InboxPage);
                    } else {
                        this.nav.push(LoginPage);
                    }
                });

            }
        });

        this.pushObj.on('error').subscribe( (e) => {
            console.log("PUSH PLUGIN ERROR: " + JSON.stringify(e));
        });
    }

    back(){
        this.nav.pop();
    }

    goToPage(page){
        switch (page){
            case 'RegisterPage': {
                this.pageGo = RegisterPage;
                break;
            }
            case 'ContactPage': {
                this.pageGo = ContactPage;
                break;
            }
            case 'HomePage': {
                this.pageGo = HomePage;
                break;
            }
            case 'LoginPage': {
                this.pageGo = LoginPage;
                break;
            }
            case 'inbox': {
                this.pageGo = InboxPage;
                break;
            }
            case 'invitations': {
                this.pageGo = InvitationsPage;
                break;
            }
        }

        this.nav.push(this.pageGo);
    }

    goToChat(user){
        this.pageGo = ChatPage;
        this.nav.push(this.pageGo,{user: user});

    }

    getBingo(){
        this.api.storage.get('status').then((val) => {
            if (val) {
                this.api.http.get(this.api.url + '/user/bingo', this.api.setHeaders(true)).subscribe(
                    (data: any) => {
                        console.log('bingo: ', data);
                        this.bingo = data.bingo.items
                        if(this.bingo.length > 0){
                            this.showSplash();
                        }
                    }, err => {
                        console.log('bingo: ', err);

                    }
                );
            }
        });
        let that = this;
        setTimeout(function () {
            that.getBingo();
        }, 8000);
    }

    getCounters(){
        this.api.storage.get('status').then((val) => {
            if (val) {
                this.api.http.get(this.api.url + '/user/newMessagesCount',this.api.setHeaders(true)).subscribe(
                    (data: any) => {
                        console.log('newMessagesCount: ', data);
                        this.counters = data.counters;
                        if(this.counters.newMessagesCount > 0){
                            $('.mo-notify').show();
                        }else{
                            $('.mo-notify').hide();
                        }
                        if(this.counters.newNotificationsCount > 0){
                            $('#my_arena .counter').show();
                        }else{
                            $('#my_arena .counter').hide();
                        }
                        if(this.counters.newDatingCount > 0){
                            $('#invitations .counter').show();
                        }else{
                            $('#invitations .counter').hide();
                        }
                    }, err => {
                        console.log('newMessagesCount: ', err);

                    }
                );
            }else{
                $('#my_arena,#invitations,.mo-notify').hide();
            }
        });
        let that = this;
        setTimeout(function () {
            that.getCounters();
        }, 8000);
    }

    showTest(){
        let div: any = document.createElement('div');
        div.id = 'splashBingo';
        div.class = 'mo-pop pop2';
        div.innerHTML = '<div onclick="close" class="cancel"></div>            <img class="bingoImg" src="/images/bingo/bingo.png" />        <div class="clear"></div>        <div class="rightPhoto">        <div class="imageBingo" style="background-image:url();"></div>        </div>        <div class="leftPhoto">        <div class="imageBingo" style="background-image:url();"></div>        </div>        <div class="plus"></div>        <div class="clear"></div>        <div class="textSplash">גם  בעניין שלך!</div>        <div class="chat" onclick="chat">            <span>דברו איתם</span>        </div>        <div class="ignore" onclick="close">            <span>המשיכו לדפדף</span>        </div>';
        [].forEach.call(div.getElementsByTagName("div"), (a) => {
            var pageHref = a.getAttribute('onclick');
            if (pageHref) {
                a.removeAttribute('onclick');
                a.onclick = () => this.bingoFn(pageHref,{});
            }
        });
        $('body').append(div);

    }



    showSplash(){
        //alert();
        if($('#splashBingo').length == 0 && this.api.activePageName != 'ChatPage'){
            let splash = this.bingo[0];
            this.bingo.splice(0, 1);
            let div: any = document.createElement('div');
            div.id = 'splashBingo';
            div.class = 'mo-pop pop2';
            div.innerHTML = splash.html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.bingoFn(pageHref,splash.user);
                }
            });
            $('body').append(div);

            this.api.http.post(this.api.url + '/user/bingo/splashed',splash,this.api.setHeaders(true)).subscribe(
                (data: any) => {
                    console.log('splashed: ', data);

                }, err => {
                    console.log('splashed: ', err);

                }
            );

        }
    }

    bingoFn(action,user){
        //alert(JSON.stringify(user));
        switch (action){
            case 'chat': {
                this.goToChat(user);
                break;
            }
        }
        $('#splashBingo').remove();
        if(typeof this.bingo != 'undefined' && this.bingo.length > 0){
            let that = this;
            setTimeout(function () {
                that.showSplash();
            },3000);

        }
    }

    contact(){
        this.nav.push(ContactPage);
    }

    notifications(){
        this.nav.push(NotificationPage);
    }

    logout(){
        this.api.storage.remove('status');
        this.api.http.get(this.api.url + '/user/logout', this.api.setHeaders(true)).subscribe(data => {
            //alert(JSON.stringify(data));
            console.log('logout: ', data);
            // $('#my_arena,#invitations,.mo-notify').hide();
            // this.api.storage.remove('user_id');
            // this.rootPage = LoginPage;
            // //this.nav.push(this.rootPage);
            // this.nav.setRoot(this.rootPage);
            // this.nav.popToRoot();
        }, err => {
            console.log('logout: ', err);

        });
        $('#my_arena,#invitations,.mo-notify').hide();
        this.api.storage.remove('user_id');
        this.rootPage = LoginPage;
        //this.nav.push(this.rootPage);
        this.nav.setRoot(this.rootPage);
        this.nav.popToRoot();

    }

    goHome() {
        this.api.storage.get('status').then((val) => {
            if (!val) {
                this.rootPage = LoginPage;
                this.status = 'logout';
            } else {
                this.status = 'login';
                this.rootPage = HomePage;
                //this.rootPage
            }
            this.nav.setRoot(this.rootPage);
            this.nav.popToRoot();
        });
    }

    ngAfterViewInit() {
        this.nav.viewDidEnter.subscribe((view) => {
            if(this.platform.is('ios')) {
                if(this.platform.versions().ios.num < 11){
                    $('.mo-innheader.header-ios,.content.content-ios').addClass('old-v')
                    //alert(JSON.stringify(platform.versions()));
                }
            }
           if(this.api.pageName == 'LoginPage'){
               $('#register,#contact').removeAttr('style').show();
               $('#back,#logout').hide();
           }
        });
    }
}

