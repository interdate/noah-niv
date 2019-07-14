import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {ProfilePage} from "../profile/profile";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-results',
    templateUrl: 'results.html',
})
export class ResultsPage {

    params: any;
    pageData: any;
    defaultData: any = {
        title: 'תוצאות',
        text_online: '(כרגע באתר)',
        label_about: 'מעט עליי:',
        send_message: 'שליחת הודעה',
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
        if(this.navParams.get('search')){
            this.params = this.navParams.get('search');
        }
        this.pageData = this.defaultData;
        this.getUsers();
    }

    profile(user){
        this.navCtrl.push(ProfilePage, {user: user});
    }

    chat(user){
        this.navCtrl.push(ChatPage, {user: user});
    }

    ionViewWillEnter() {
        this.api.activePageName = 'ResultsPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

    getUsers(){
        this.api.http.post(this.api.url + '/user/search',this.params,this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('searchResults: ', data);
                //alert(typeof data.users);
                if(typeof data.users != 'undefined') {
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

    doInfinite(infiniteScroll) {
        //console.log('Begin async operation');
        this.params.page = this.params.page + 1;
        this.scroll = infiniteScroll;
        this.getUsers();

    }

}
