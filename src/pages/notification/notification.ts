import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import * as $ from "jquery";
import {ChatPage} from "../chat/chat";
import {ArenaPage} from "../arena/arena";

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {

    notifications: any;
    pageData: any;
    defaultData: any = {
        title: 'התראות מהתיבה',
        no_results: 'לא נמצאו תוצאות'
    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http
    ) {
        this.pageData = this.defaultData;
        this.api.showLoad();
        this.http.get(this.api.url + '/user/likes/notifications',this.api.setHeaders(true)).subscribe(
            data => {
                console.log('notifications: ', data.json().likesNotifications);
                this.notifications = data.json().likesNotifications;
                this.pageData = (typeof data.json().pageData == 'undefined') ? this.defaultData : data.json().pageData;
                this.api.hideLoad();
            }, err => {
                console.log('notifications: ', err);
                this.api.hideLoad();
            }
        );
    }

    notifClick(notification){
        //read
        this.readNotif(notification.id);
        if(notification.bingo == '1'){
            this.navCtrl.push(ChatPage,{
                user:
                {
                    main: notification.user.main,
                    id: notification.user.userId,
                    userfName: notification.user.userfName,
                    mainImage: notification.user.mainImage
                }
            });
        }else{
            this.navCtrl.push(ArenaPage,{params: {userId: notification.userId, notificationId: notification.id}});
        }
    }

    readNotif(id){
        $('.notificat_' + id).parents('li').removeClass('active');
        this.http.post(this.api.url + '/user/notification/' + id + '/read',{},this.api.setHeaders(true)).subscribe(
            data => {
                this.api.hideLoad();
            }, err => {
                console.log('notifications: ', err);
                this.api.hideLoad();
            }
        );
    }

    ionViewWillEnter() {
        this.api.activePageName = 'NotificationPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

}
