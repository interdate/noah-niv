import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import * as $ from "jquery";
import {ChatPage} from "../chat/chat";
import {ProfilePage} from "../profile/profile";
import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";



@IonicPage()
@Component({
    selector: 'page-arena',
    templateUrl: 'arena.html',
})
export class ArenaPage {

    @ViewChild(Slides) slides: Slides;
    users: any;
    page: any = 1;
    showUsers: any = [];
    perCount: any = 25;
    params: any = {
        userId: 0,
        notificationId: 0
    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http
    ) {
        this.api.showLoad();
        if(this.navParams.get('params')){
            this.params = this.navParams.get('params');
        }
        this.http.get(this.api.url + '/users/forLikes/' + this.params.userId + '/' + this.params.notificationId, this.api.setHeaders(true)).subscribe(
            data => {
                this.users = data.json().users;
                this.api.hideLoad();
                if(data.json().userHasNoMainImage == false) {
                    this.addUsers();
                    if (this.users.items.length > 3) {
                        this.addUsers();
                        if (this.users.items.length == 1) {
                            this.addUsers();
                        }
                    }
                }else{
                    this.navCtrl.push(RegisterPage,{user: {step: 3, register: false, userHasNoMainImage: true}});
                    this.navCtrl.remove(1);
                }
            }, err => {
                console.log('forLikes: ', err);
                this.api.hideLoad();
            }
        );
    }

    addUsers(){

        let start = (this.page == 1) ? 0 : ((this.page - 1) * this.perCount);
        let end = this.page * this.perCount;
        if(end > this.users.items.length){
            end = this.users.items.length;
            this.page = 0;
        }
        //alert(start + ' | ' + end);

        for (var i = start; i < end; i++) {
            this.showUsers.push(this.users.items[i]);
        }



        //alert(this.showUsers.length + ' | ' + this.perCount * 3);
        if(this.showUsers.length >= this.perCount * 3){
            //this.api.showLoad();
            this.showUsers.splice(0, this.perCount);
            this.slides.slideTo(this.slides.getActiveIndex() - this.perCount, 0);
            //this.api.hideLoad();
        }
        this.page++;
    }

    arenaClick(action){
        let index = this.slides.getActiveIndex();
        let user = this.showUsers[index];

        switch (action) {
            case 'unlike': {
                this.slides.slideNext(300);
                break;
            }
            case 'chat': {
                this.navCtrl.push(ChatPage,{user: user});
                break;
            }
            case 'like': {

                this.showUsers.splice(index, 1);
                if(this.slides.getActiveIndex() != 0) {
                    this.slides.slideTo(this.slides.getActiveIndex() - 1, 0);
                }
                //alert(JSON.stringify(user));
                for(var e in this.users.items){
                    //alert(JSON.stringify(user));
                    if(typeof this.users.items[e] != 'undefined' && this.users.items[e].id == user.id){
                        this.users.items.splice(e, 1);
                    }
                }
                for(var n in this.showUsers){
                    if(typeof this.showUsers[n] != 'undefined' && this.showUsers[n].id == user.id){
                        this.showUsers.splice(n, 1);
                        //this.slides.update();
                    }
                }

                var that = this;
                setTimeout(function () {
                    if(that.users.items.length == 0){
                        that.users.items = that.showUsers = [];
                    }
                    if(that.users.items.length == 1){
                        that.slides.slideTo(0, 0);
                    }
                },100);

                this.sendLike(user);
                break;
            }
            case 'profile': {
                this.navCtrl.push(ProfilePage,{user: user});
                break;
            }
        }
    }

    sendLike(user){
        this.http.post(this.api.url + '/user/like/' + user.id, {}, this.api.setHeaders(true)).subscribe(
            data => {
                //this.users = data.json().users;
                //this.api.hideLoad();
                //this.addUsers();
            }, err => {
                console.log('forLikes: ', err);
                //this.api.hideLoad();
            }
        );
    }

    slideChanged(){
        var that = this;
        setTimeout(function () {
            if(that.slides.getActiveIndex() + 2 >= that.showUsers.length || that.showUsers.length < 3){
                //that.page++;
                that.addUsers();
            }
        },5);

    }

    ionViewWillEnter() {
        this.api.activePageName = 'ArenaPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

}
