import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {Http} from "@angular/http";
import {ResultsPage} from "../results/results";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {

    form: any;
    search: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http
    )
    {
        this.api.showLoad();
        this.http.get(this.api.url + '/user/search', this.api.setHeaders(true)).subscribe(
            data => {
                //alert(JSON.stringify(data));
                console.log('search: ', data.json());
                this.form = data.json().form;
                this.search = data.json().search;
                this.api.hideLoad();

                //this.content.scrollToTop(300);
            }, err => {
                console.log('search: ', err);
                //this.api.storage.remove('status');
                //this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

    ionViewWillEnter() {
        this.api.activePageName = 'SearchPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

    goSearch(){
        this.navCtrl.push(ResultsPage,{search: this.search});
    }

}
