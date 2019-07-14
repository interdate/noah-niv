import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {ProfilePage} from "../profile/profile";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    @ViewChild(Content) content: Content;
    pageData: any;
    defaultData: any = {
        title: 'שיחה עם'
    };
    chat: any;
    user: any;
    message: any = '';
    interval: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public alertCtrl: AlertController
    ) {
        this.pageData = this.defaultData;
        this.user = this.navParams.get('user');
        if(!this.user.main){
            this.user.main = this.user.mainImage[0].url;
        }
        this.init();
        console.log(this.user);
    }

    init(){
        if(typeof this.interval != 'undefined') {
            clearInterval(this.interval);
        }
        this.api.showLoad();
        this.api.http.get(this.api.url + '/user/chat/' + this.user.id,this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('searchResults: ', data);
                //data.chat.items.reverse();
                this.chat = data.chat;
                this.chat.items.reverse();

                if(data.pageData) {
                    this.pageData = data.pageData;
                }else{
                    this.pageData = this.defaultData;
                }
                this.api.hideLoad();
                let that = this;
                setTimeout(function(){that.content.scrollToBottom(300);},10);

                this.interval = setInterval(function () {
                    that.refresh();
                }, 7000);

            }, err => {
                console.log('searchResults: ', err);

                this.api.hideLoad();
            });
    }

    setText(mess){
        let userId = this.user.id;
        if(($('.text_' + mess.id).html() == '' && mess.text != '') || ($('.text_' + mess.id).html() != mess.text && mess.text != '')) {
            let div: any = document.createElement('div');
            div.innerHTML = mess.text;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getSubscribe(userId);
                }
            });
            $('.text_' + mess.id).html(div);
        }



    }

    send(){
        if(this.message != ''){
            if(typeof this.chat.alertMess != 'undefined'){
                this.message = '';
                let alert = this.alertCtrl.create({
                    title: this.chat.alertMess.title,
                    subTitle: this.chat.alertMess.message,
                    buttons: [this.chat.alertMess.button]
                });
                alert.present();
            }else {
                let data = {message: this.message};
                let that = this;
                let userId = this.chat.currentUserId;
                this.chat.items.push({
                    id: 0,
                    date: '',
                    from: userId,
                    readClass: '',
                    text: this.message,
                    time: '',
                    to: this.user.id
                });
                this.message = '';

                setTimeout(function () {
                    that.content.scrollToBottom(300);
                }, 10);

                this.api.http.post(this.api.url + '/user/chat/' + this.user.id, data, this.api.setHeaders(true)).subscribe(
                    (data: any) => {
                    this.api.hideLoad();
                    console.log('searchResults: ', data);
                    if (typeof data.chat != 'undefined') {
                        // this.chat = data.chat;
                        // this.chat.items = [];
                        // data.chat.items.forEach(mess => {
                        //     this.chat.items.unshift(mess);
                        // });
                        this.chat = data.chat;
                        this.chat.items.reverse();
                        if (typeof this.chat.alertMess != 'undefined') {
                            let alert = this.alertCtrl.create({
                                title: this.chat.alertMess.title,
                                subTitle: this.chat.alertMess.message,
                                buttons: [this.chat.alertMess.button]
                            });
                            alert.present();
                        }
                        this.sendPush();
                    }

                    setTimeout(function () {
                        that.content.scrollToBottom(300);
                    }, 10);
                }, err => {
                    console.log('searchResults: ', err);

                    this.api.hideLoad();
                });
            }
        }
    }

    sendPush(){
        this.api.http.post(this.api.url + '/user/push/' + this.user.id, {}, this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('searchResults: ', data);
        }, err => {
            console.log('searchResults: ', err);

            this.api.hideLoad();
        });

    }

    refresh(){
        if(this.api.activePageName == 'ChatPage') {
            this.api.http.get(this.api.url + '/user/chat/' + this.user.id + '/refresh/' + this.chat.countNotRead, this.api.setHeaders(true)).subscribe(
                (data: any) => {
                    let that = this;
                    if (data.chat != false) {
                        // this.chat = data.chat;
                        // this.chat.items = [];
                        // data.chat.items.forEach(mess => {
                        //     this.chat.items.unshift(mess);
                        // });
                        this.chat = data.chat;
                        this.chat.items.reverse();
                        this.api.hideLoad();
                        setTimeout(function () {
                            that.content.scrollToBottom(300);
                        }, 10);
                    }

                }, err => {
                    console.log('searchResults: ', err);

                    this.api.hideLoad();
                }
            );
        }
    }

    getSubscribe(userId){

    }

    ionViewWillLeave() {
        $('.footer').hide();
        clearInterval(this.interval);
    }

    profile(){
        this.navCtrl.push(ProfilePage,{user: this.user});
    }

    ionViewWillEnter() {
        this.api.activePageName = 'ChatPage';
        $('.footer').removeAttr('style');
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

}
