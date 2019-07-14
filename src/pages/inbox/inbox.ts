import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html',
})
export class InboxPage {

    pageData: any;
    defaultData: any = {
        title: 'הודעות',
        //text_online: '(כרגע באתר)',
        //label_about: 'מעט עליי:',
        //send_message: 'שליחת הודעה',
        height_mesure: 'ס״מ',
        no_results: 'לא נמצאו תוצאות'
    };
    page: any = 1;
    users: any = [];
    scroll: any;
    init: any = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery
    ) {
        this.api.showLoad();
        this.pageData = this.defaultData;
        this.getUsers();
    }

    ionViewWillEnter() {
        this.api.activePageName = 'InboxPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

    getUsers(){
        this.api.http.get(this.api.url + '/user/contacts/perPage:20/page:' + this.page, this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('searchResults: ', data);
                if(typeof data.users != 'undefined' && data.users.length > 0) {
                    data.users.forEach(user => {
                        this.users.push(user);
                    });
                }
                this.init = false;
                if(data.pageData) {
                    this.pageData = data.pageData;
                }else{
                    this.pageData = this.defaultData;
                }
                this.api.hideLoad();
                if(typeof this.scroll !== 'undefined'){
                    this.scroll.complete();
                }
            }, err => {
                console.log('searchResults: ', err);

                this.api.hideLoad();
            }
        );
    }

    chat(user){
        this.navCtrl.push(ChatPage,{user: user.user});
    }

    doInfinite(infiniteScroll) {
        //console.log('Begin async operation');
        this.page = this.page + 1;
        this.scroll = infiniteScroll;
        this.getUsers();

    }

}
