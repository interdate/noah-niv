import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from '../../library/api-query';
import {RegisterPage} from "../register/register";
import {ContactPage} from "../contact/contact";
import {SearchPage} from "../search/search";
import {ResultsPage} from "../results/results";
import {ProfilePage} from "../profile/profile";
import {InboxPage} from "../inbox/inbox";
import {ArenaPage} from "../arena/arena";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public goPage: any;
    public params: any = {};

    constructor(public navCtrl: NavController, public api: ApiQuery) {
        $('#my_arena,#invitations').show();
    }

    ionViewWillEnter() {
        this.api.activePageName = 'HomePage';
        $('#logout').show();
        $('#register,#back,#contact').hide();
        $('.header').removeClass('not-login');
    }

    goTo(pageName) {
        switch (pageName) {
            case 'edit': {
                this.goPage = RegisterPage;
                this.params = {user: {step: 0, register: false}};
                break;
            }
            case 'photos': {
                this.goPage = RegisterPage;
                this.params = {user: {step: 3, register: false}};
                break;
            }
            case 'contact': {
                this.goPage = ContactPage;
                this.params = {};
                break;
            }
            case 'search': {
                this.goPage = SearchPage;
                this.params = {};
                break;
            }
            case 'looked':
            case 'lookedMe':
            case 'contactedThem':
            case 'friends': {
                this.goPage = ResultsPage;
                this.params = {search:{
                    action: 'stat',
                    list: pageName,
                    page: 1
                }};
                break;
            }
            case 'online': {
                this.goPage = ResultsPage;
                this.params = {search:{
                    action: 'online',
                    page: 1
                }};
                break;
            }
            case 'profile': {
                this.goPage = ProfilePage;
                this.params = {user:{}};
                break;
            }
            case 'inbox': {
                this.goPage = InboxPage;
                this.params = {};
                break;
            }
            case 'arena':{
                this.goPage = ArenaPage;
                this.params = {};
                break;
            }

        }
        this.navCtrl.push(this.goPage, this.params);
    }
}
