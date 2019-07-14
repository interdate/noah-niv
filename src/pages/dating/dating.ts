import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from "../../library/api-query";
import {HomePage} from "../home/home";
//import set = Reflect.set;



@IonicPage()
@Component({
    selector: 'page-dating',
    templateUrl: 'dating.html',
})
export class DatingPage {
    @ViewChild(Content) content: Content;
    form: any;
    invite: any;
    errors: any = {};
    pageData: any;
    inviteDate: any;
    inviteTime: any;
    chooseRes: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery
    ) {
        this.api.showLoad();
        this.api.http.post(this.api.url + '/user/invite/' + this.navParams.get('userId'),{},this.api.setHeaders(true)).subscribe(
            (data: any) => {
                //alert(JSON.stringify(data));
                console.log('register: ', data);
                this.form = data.form;
                this.invite = data.invite;
                if (data.errors) {
                    this.errors = data.errors;
                }
                this.pageData = this.form.pageData;
                this.content.scrollToTop(300);
                this.api.hideLoad();
            }, err => {
                console.log('register: ', err);
                //this.api.storage.remove('status');
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

    setHtmlById(id, html){
        setTimeout(function () {
            html = html.replace("[COUNT]",$('#restorans ul li').length);
            if($('#' + id).html() != html) {
                $('#' + id).html(html);
                // let div: any = document.createElement('div');
                // div.innerHTML = html;
                // $('#' + id).append(div);
            }
        },10);

    }

    goToHome(){
        //this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    clickByElement(el){
        $(el).click();
    }

    chooseDate(field){
        var res = this.inviteDate.split("-");

        this.invite[field.name_y] = res[0];
        this.invite[field.name_m] = res[1];
        this.invite[field.name_d] = res[2];
    }

    chooseTime(field){
        var res = this.inviteTime.split(":");
        this.invite[field.name_h] = res[0];
        this.invite[field.name_min] = res[1];
    }

    restoranSel(field){
        this.chooseRes = field;
        this.setHtmlById('rest-html', this.chooseRes.data.html);
        $('#form').hide();
        $('#restorans').show();
        this.content.scrollToTop(300);
    }

    selectRestoran(restoran){
        this.invite.countryRegionId = restoran.countryRegionId;
        var that = this;
        setTimeout(function(){
            that.invite.restoran = restoran.placeId;
        },20);

        $('#form').show();
        $('#restorans').hide();
        this.content.scrollToTop(300);
    }

    ionViewWillEnter() {
        this.api.activePageName = 'DatingPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

    sendInvite(){
        this.api.showLoad();
        this.errors = {};
        this.api.http.post(this.api.url + '/user/invite/' + this.navParams.get('userId'),this.invite,this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('invite: ', data);
                this.api.hideLoad();
                this.form = data.form;
                this.invite = data.invite;
                if (data.errors) {
                    this.errors = data.errors;
                    this.content.scrollToTop(300);
                }
                this.pageData = this.form.pageData;

            }, err => {
                console.log('register: ', err);
                //this.api.storage.remove('status');
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

}
