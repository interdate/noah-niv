import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {HeilbaumPhotoswipeController, PhotoswipeOptions, HeilbaumPhotoswipe} from "heilbaum-ionic-photoswipe";
import {ResultsPage} from "../results/results";
import {ChatPage} from "../chat/chat";
import {DatingPage} from "../dating/dating";
//import {PhotoSwipe, PhotoSwipeUI_Default} from "photoswipe";



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    @ViewChild(Content) content: Content;
    user: any;
    pageData: any = {};
    previewItems: Array<{
        src?: string;
        w?: number;
        h?: number;
        html?: string;
        title?: string;
        custom?: any;}>;
    rep_ab: any = { show: false, value: ''};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        protected pswpCtrl: HeilbaumPhotoswipeController,
        private alertCtrl: AlertController
    ) {
        this.user = this.navParams.get('user');
        console.log(this.user);
        this.api.storage.get('user_id').then((val) => {
            if(!this.user.id || this.user.id && val == this.user.id){
                this.pageData.title = 'הפרופיל שלי';
                this.user.id = val;
                this.api.showLoad();
            }else{
                this.pageData.title = 'הפרופיל של ' + this.user.userfName;
            }
            this.getProfileData();
        });

        this.previewItems = this.user.mainImage;
        if(typeof this.previewItems != 'undefined') {
            if (this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/0.jpg' || this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/1.jpg') {
                this.previewItems[0].src = (this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/0.jpg') ? 'images/1_0.png' : 'images/1_1.png';
                this.previewItems[0].h = this.previewItems[0].w = 260;
            }
        }
    }

    manageLists(list){
        //alert($('.' + list).hasClass('add'));
        let action = 0;
        if($('.' + list).hasClass('add')){
            action = 1;
        }

        if(list == 'fav'){
            this.user.is_in_favorite_list = $('.' + list).hasClass('add');

        }
        if(list == 'black'){
            this.user.is_in_black_list = $('.' + list).hasClass('add');
        }

        this.api.http.post(this.api.url + '/user/managelists/' + list + '/' + action + '/' + this.user.id, {}, this.api.setHeaders(true)).subscribe(
            (data: any) => {
                let alert = this.alertCtrl.create({
                    title: data.success,
                    //subTitle: '10% of battery remaining',
                    buttons: ['אישור']
                });
                alert.present();

            }, err => {
                console.log('searchResults: ', err);

                this.api.hideLoad();
            }
        );
    }

    reportAbuse(action){
        if(action == 'show') {
            this.rep_ab.show = true;
            let that = this;
            setTimeout(function () {
                that.content.scrollToBottom(300);
            },10);
        }
        if(action == 'send'){
            let mess = (this.rep_ab.value.length > 3) ? 'תודה. ההודעה נשלחה.' : 'מינימום 4 אותיות';
            let alert = this.alertCtrl.create({
                title: mess,
                buttons: ['אישור']
            });
            alert.present();
            if(this.rep_ab.value.length > 3) {
                this.rep_ab.show = false;
                this.api.http.post(this.api.url + '/user/abuse/' + this.user.id, {abuseMessage: this.rep_ab.value}, this.api.setHeaders(true)).subscribe(
                    (data: any) => {
                        this.rep_ab.value = '';
                        this.api.hideLoad();
                    }, err => {
                        console.log('searchResults: ', err);

                        this.api.hideLoad();
                    }
                );
            }

        }
    }

    getProfileData(){
        this.api.http.get(this.api.url + '/user/profile/' + this.user.id, this.api.setHeaders(true)).subscribe(
            (data: any) => {
                //console.log('searchResults: ', data);
                this.user = data.user;
                this.previewItems = data.images;
                if(this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/0.jpg' || this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/1.jpg'){
                    this.previewItems[0].src = (this.previewItems[0].src == 'https://www.dos2date.co.il/images/users/large/0.jpg') ? 'images/1_0.png' : 'images/1_1.png';
                    this.previewItems[0].h = this.previewItems[0].w = 260;
                }
                if(data.pageData) {
                    this.pageData = data.pageData;
                }
                this.api.hideLoad();

            }, err => {
                console.log('searchResults: ', err);

                this.api.hideLoad();
            }
        );
    }

    stat(link){
        this.navCtrl.push(ResultsPage, {search:{action: 'stat', list: link, page: 1}});
    }

    chat(){
        this.user.mainImage = this.previewItems;
        this.navCtrl.push(ChatPage,{user: this.user});
    }

    dating(){
        this.navCtrl.push(DatingPage, {userId: this.user.id});
    }

    /**
     * Shows a PhotoSwipe gallery from single thumbnail
     */
    protected pswpSingleThumbnail(index): void {
        let options: PhotoswipeOptions = {
            clickToCloseNonZoomable: false,
            showHideOpacity: false,
            index: index,
            history: false,
            focus: false,
            timeToIdle: 4000,
            maxSpreadZoom: 1,
            arrowKeys: false,
            fullscreenEl: false,
            zoomEl: false,
            shareEl: false,
            counterEl: false,
            arrowEl: false,
            closeEl: true,
        };

        const pswp: HeilbaumPhotoswipe = this.pswpCtrl.create(this.previewItems, options);
        pswp.present({ animate: false });
        pswp.setLeavingOpts({ animate: false });
    }



    ionViewWillEnter() {
        this.api.activePageName = 'ProfilePage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

}
