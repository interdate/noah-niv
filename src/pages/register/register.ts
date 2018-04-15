import { Component, ViewChild } from '@angular/core';
import {ActionSheetController, Content, NavController, NavParams, Platform} from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {Http} from "@angular/http";
import {HomePage} from "../home/home";
import {Page} from "../page/page";
declare var setChoosen;
declare var setSelect2;




@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    @ViewChild(Content) content: Content;
    login: any = false;
    user: any = {};
    form: any = {fields: []};
    errors: any;
    activePhoto: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public http: Http,
        public platform: Platform,
        private camera: Camera,
        public imagePicker: ImagePicker,
        private transfer: FileTransfer,
        //private file: File,
        public actionSheetCtrl: ActionSheetController
    ) {
        api.storage.get('status').then((val) => {

            this.login = val;
            this.user = this.navParams.get('user');
            this.sendForm();
        });


        //AbstractChosen = $;
        //var jQuery = $;
        //jQuery = setChoosen(jQuery);
    }

    sendForm(){
        this.api.showLoad();
        var header = this.api.setHeaders((this.login == 'login') ? true : false);
        //console.log(header);
        //alert(this.login);
        if(typeof this.user != 'undefined' && this.user.step != 3) {
            //this.user.userCity = $('#userCity').val();
            //this.user.countryOfOriginId = $('#countryOfOriginId').val();
            this.form.fields.forEach(field => {
                if(field.type == 'select'){
                    this.user[field.name] = $('#' + field.name).val();
                }
            });
        }
        this.http.post(this.api.url + '/user/register', this.user, header).subscribe(
            data => {
                //alert(JSON.stringify(data));
                console.log('register: ', data.json());
                console.log('register: ',JSON.stringify(data.json()));
                this.form = data.json().form;
                this.user = data.json().user;
                this.errors = data.json().errors;

                if(this.user.step == 3 ){
                    this.api.setHeaders(true,this.user.userEmail,this.user.userPass);
                    this.login = 'login';
                    this.api.storage.set('status','login');
                    this.api.storage.set('user_id',this.user.userId);
                    this.api.storage.set('username',this.user.userEmail);
                    this.api.storage.set('password',this.user.userPass);
                    //alert(JSON.stringify(this.user.photos));
                    let that = this;
                    setTimeout(function () {
                        that.api.hideLoad();
                    },1000);
                }else{
                    this.api.hideLoad();
                }
                if(this.user.step == 2 && !this.user.register){
                    this.api.storage.set('username',this.user.userEmail);
                    this.api.setHeaders(true,this.user.userEmail);
                }
                if(this.user.step != 3){
                    //this.choosen('#userCity,#countryOfOriginId');

                    this.form.fields.forEach(field => {
                        if(field.type == 'select' /*&& field.name != 'userCity' && field.name != 'countryOfOriginId'*/){
                            this.select2(field);
                        }
                    });
                }
                this.content.scrollToTop(300);
            }, err => {
                console.log('registerError: ', err);
                console.log('registerError: ',JSON.stringify(err));
                //this.api.storage.remove('status');
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

    choosen(sel){
        setChoosen(sel,
            {
                no_results_text: "אין תוצאות",
                width: "100%",
                search_contains: true,
                enable_split_word_search: false
            }
        );

    }

    select2(field){
        setSelect2('#' + field.name,
            {
                placeholder: "בחר מהרשימה"
            }
        );
    }

    stepBack(){
        this.user.step = this.user.step - 2;
        this.sendForm();
    }

    setHtml(id,html){
        if($('#' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            $('#' + id).append(div);
        }
    }

    getPage(pageId){
        this.navCtrl.push(Page,{pageId: pageId});
    }

    ionViewWillEnter() {
        this.api.activePageName = 'ContactPage';
        $('#back').show();
        $('#logout,#register').hide();
        this.api.storage.get('status').then((val) => {
            this.login = val;
            if(this.login == 'login'){
                $('#contact').hide();
                $('.header').removeClass('not-login');
            }else{
                $('#contact').css({'left': '15px', 'right': 'auto'}).show();
                $('.header').addClass('not-login');
            }
            setTimeout(function () {
                $('.fixed-content,.scroll-content').css({'margin-top': $('.header').innerHeight() + 'px'});
            },10);
        });

    }

    ionViewWillLeave() {
        $('#contact').removeAttr('style');
        if(this.login == 'login'){
            //this.navCtrl.push(HomePage);
            $('.mo-logo').click();
        }

    }

    edit(photo) {
        this.activePhoto = photo;
        let mainOpt = [];
        /*{
         text: 'Preview photo',
         icon: 'person',
         handler: () => {
         console.log('Destructive clicked');
         }
         }
         */
        console.log(photo);

        mainOpt.push({
            text: this.form.texts.choose_from_camera,
            icon: 'aperture',
            handler: () => {
                this.openCamera();
            }
        });
        mainOpt.push({
            text: this.form.texts.choose_from_gallery,
            icon: 'photos',
            handler: () => {
                this.openGallery();
            }
        });

        //alert(JSON.stringify(photo));

        if(this.user.noPhoto != photo.url && photo.imgMain == '0') {
            mainOpt.push({
                text: this.form.texts.delete,
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.user.photo = {
                        id: photo.id,
                        action: 'delete'
                    };
                    //this.delete(photo);
                    this.sendForm();
                }
            });
        }

        // if (photo.main == '0' && photo.isValid == '1') {
        //
        //     mainOpt.push({
        //             text: this.form.texts.set_as_main_photo,
        //             icon: 'contact',
        //             handler: () => {
        //                 this.user.photo = {
        //                     id: photo.id,
        //                     action: 'main'
        //                 };
        //                 //this.postPageData('mainImage', photo);
        //                 this.sendForm();
        //             }
        //         }
        //     );
        // }

        mainOpt.push({
            text: this.form.texts.cancel,
            role: 'destructive',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });


        var status = photo.imgValidated == '1'
            ?
            this.form.texts.approved
            :
            this.form.texts.waiting_for_approval;

        var subTitle = (photo.id == 0) ? '' : this.form.texts.status + ': ' + status;

        let actionSheet = this.actionSheetCtrl.create({
            title: photo.type_title,

            subTitle: subTitle,

            buttons: mainOpt
        });

        actionSheet.present();
    }

    add() {

        let actionSheet = this.actionSheetCtrl.create({
            title: this.form.texts.add_photo,
            buttons: [
                {
                    text: this.form.texts.choose_from_camera,
                    icon: 'aperture',
                    handler: () => {
                        this.openCamera();
                    }
                }, {
                    text: this.form.texts.choose_from_gallery,
                    icon: 'photos',
                    handler: () => {
                        this.openGallery();
                    }
                }, {
                    text: this.form.texts.cancel,
                    role: 'destructive',
                    icon: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    openGallery() {

        let options = {
            maximumImagesCount: 1,
            width: 600,
            height: 600,
            quality: 98
        };

        this.imagePicker.getPictures(options).then(
            (file_uris) => {
                this.uploadPhoto(file_uris[0]);
            },

            (err) => {
                alert(JSON.stringify(err));

            }
        );
    }

    openCamera() {

        const options: CameraOptions = {
            quality: 100,
            destinationType: 1,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeight: 600,
            saveToPhotoAlbum: true,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        };

        this.camera.getPicture(options).then((imageData) => {

            this.uploadPhoto(imageData);
        }, (err) => {
            console.log(err);
        });
    }

    uploadPhoto(url) {

        this.api.showLoad();

        let options: FileUploadOptions = {
            fileKey: "file",
            fileName: 'test.jpg',
            mimeType: "image/jpg",
            chunkedMode: false,
            headers: this.api.getAuthHeader()
        };

        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(url, this.api.url + '/user/image/' + this.activePhoto.id + '/' + this.activePhoto.type, options).then((entry) => {
            this.api.hideLoad();
            //alert(JSON.stringify(entry));
            console.log('upload' + JSON.stringify(entry));
            this.sendForm();

        }, (err) => {
            //alert(JSON.stringify(err));
            this.api.hideLoad();
            console.log('uploadError' + JSON.stringify(err));

        });


    }

    goToHome(){
        //this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }


}
