import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import * as $ from "jquery";
import {DatingPage} from "../dating/dating";
import {HomePage} from "../home/home";

/**
 * Generated class for the InvitationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-invitations',
    templateUrl: 'invitations.html',
})
export class InvitationsPage {

    userId: any;
    invitation: any;
    message: any;
    invitations: any;
    pageData: any;
    defaultData: any = {
        title: 'הזמנה לדייט',
        no_results: 'לא נמצאו תוצאות',
        home_button_text: 'לעמוד הראשי'
    };
    tabs: any = 'invite_me';
    invite: any = {i_invite: [], invite_me: [] };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http
    ) {
        this.pageData = this.defaultData;
        if (this.navParams.get('invitation')) {
            this.invitation = this.navParams.get('invitation');
            this.userId = this.navParams.get('userId');
            this.pageData.title = (this.invitation.approved == '1') ? this.invitation.title2 : this.invitation.title;
        }
        if (this.navParams.get('message')) {
            this.message = this.navParams.get('message');
        }
    }

    updateData(){
        this.api.showLoad();
        this.http.get(this.api.url + '/user/invitations', this.api.setHeaders(true)).subscribe(
            data => {
                this.userId = data.json().userId;
                this.invitations = data.json().invitations;
                //alert(JSON.stringify(this.invite));

                this.setDateFormat();
                let inviteAr = {i_invite:[],invite_me:[]};
                this.invitations.forEach(function (invite1) {
                    //
                    if( data.json().userId == invite1.userId ){

                        inviteAr.i_invite.push(invite1);
                    }else{
                        inviteAr.invite_me.push(invite1);
                    }
                });
                this.invite = inviteAr;
                this.pageData = (typeof data.json().pageData == 'undefined') ? this.defaultData : data.json().pageData;
                this.api.hideLoad();
            }, err => {
                console.log('notifications: ', err);
                this.api.hideLoad();
            }
        );
    }

    inviteSet(val){
        //save
        this.invitation.approved = 1;
        this.api.showLoad();
        this.http.post(this.api.url + '/user/invitations', {invitation: this.invitation, action: val}, this.api.setHeaders(true)).subscribe(
            data => {
                this.api.hideLoad();
                if(val == 2){
                    this.navCtrl.push(DatingPage,{userId: this.invitation.userId});
                }else{
                    this.navCtrl.push(InvitationsPage,{
                        message: {
                            photo: (this.invitation.userId == this.userId) ? this.invitation.userToMain : this.invitation.userMain,
                            name: (this.invitation.userId == this.userId) ? this.invitation.userToUserfName : this.invitation.userUserfName,
                            text: data.json().text
                        }
                    });
                    delete this.invitation;
                    this.navCtrl.remove(1);
                }
            }, err => {
                console.log('notifications: ', err);
                this.api.hideLoad();
            }
        );
    }

    goToHome(){
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    setDateFormat(){

        var invitations_new = [];
        this.invitations.forEach(invitation => {
            var data = invitation.date_date.split(" ");
            var dateArr = data[0].split("-");
            var timeArr = data[1].split(":");
            invitation.date_str = data[0] + ' ' + timeArr[0] + ':' + timeArr[1];
            var data1 = invitation.invite_date.split(" ");
            var timeArr1 = data1[1].split(":");
            var dateArr1 = data1[0].split("-");
            invitation.date_str1 = dateArr1[2] + '-' + dateArr1[1] + '-' + dateArr1[0] + ' ' + timeArr1[0] + ':' + timeArr1[1];

            invitation.y = dateArr[0];
            invitation.m = dateArr[1];
            invitation.d = dateArr[2];
            invitation.h = timeArr[0];
            invitation.min = timeArr[1];
            invitations_new.push(invitation);
        });
        this.invitations = invitations_new;

    }

    readInvitatio(invite,needRead){
        if(typeof needRead == 'undefined'){
            needRead = 1;
        }
        $('.date_' + invite.dateInviteId).parents('li').removeClass('active');
        //read
        if(invite.isRead != 1 && needRead != 0){
            this.http.post(this.api.url + '/user/invitations', {invitation:invite, field:'isRead', val:1}, this.api.setHeaders(true)).subscribe(
                data => {
                    this.api.hideLoad();
                }, err => {
                    console.log('notifications: ', err);
                    this.api.hideLoad();
                }
            );
        }
        this.navCtrl.push(InvitationsPage,{invitation: invite, userId: this.userId});
    }
/*
    onViewDidEnter(){
        alert(this.navParams.get('invitation'));
        if(!this.navParams.get('invitation')){
            this.updateData();
        }
    }
*/
    ionViewWillEnter() {
        if(!this.navParams.get('invitation') || !this.invitation){
            this.invite = {i_invite: [], invite_me: [] };
            this.updateData();
        }
        this.api.activePageName = 'InvitationPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

}
