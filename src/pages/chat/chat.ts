import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
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
        public http: Http
    ) {
        this.pageData = this.defaultData;
        this.user = this.navParams.get('user');
        this.init();

    }

    init(){
        clearInterval(this.interval);
        this.api.showLoad();
        this.http.get(this.api.url + '/user/chat/' + this.user.id,this.api.setHeaders(true)).subscribe(
            data => {
                console.log('searchResults: ', data.json());
                /*data.json().users.forEach(user => {
                    this.users.push(user);
                });
                */
                //this.init = false;
                this.chat = data.json().chat;
                this.chat.items = [];
                data.json().chat.items.forEach(mess => {
                    this.chat.items.unshift(mess);
                });

                if(data.json().pageData) {
                    this.pageData = data.json().pageData;
                }else{
                    this.pageData = this.defaultData;
                }
                //alert(JSON.stringify(this.chat));
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
        let userId = this.chat.currentUserId;
        if($('.text_' + mess.id).html() == '' && mess.text != '') {
            let div: any = document.createElement('div');
            div.innerHTML = mess.text;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getSubscribe(userId);
                }
            });
            $('.text_' + mess.id).append(div);
        }



    }

    send(){
        if(this.message != ''){
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

            setTimeout(function(){that.content.scrollToBottom(300);},10);

            this.http.post(this.api.url + '/user/chat/' + this.user.id,data,this.api.setHeaders(true)).subscribe(
                data => {
                    this.api.hideLoad();
                    console.log('searchResults: ', data.json());
                    if(typeof data.json().chat != 'undefined') {
                        this.chat = data.json().chat;
                        this.chat.items = [];
                        data.json().chat.items.forEach(mess => {
                            this.chat.items.unshift(mess);
                        });
                    }

                    setTimeout(function(){ that.content.scrollToBottom(300); },10);
                }, err => {
                    console.log('searchResults: ', err);

                    this.api.hideLoad();
                });
        }
    }

    refresh(){
        if(this.api.activePageName == 'ChatPage') {
            this.http.get(this.api.url + '/user/chat/' + this.user.id + '/refresh/' + this.chat.countNotRead, this.api.setHeaders(true)).subscribe(
                data => {
                    let that = this;
                    if (data.json().chat != false) {
                        this.chat = data.json().chat;
                        this.chat.items = [];
                        data.json().chat.items.forEach(mess => {
                            this.chat.items.unshift(mess);
                        });
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
