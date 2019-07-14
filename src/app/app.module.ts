import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import {ApiQuery} from '../library/api-query';

import { IonicStorageModule } from '@ionic/storage';
import { RecoveryPageModule } from "../pages/recovery/recovery.module";
import {ContactPageModule} from "../pages/contact/contact.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {PageModule} from "../pages/page/page.module";
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import {SearchPageModule} from "../pages/search/search.module";
import {ResultsPageModule} from "../pages/results/results.module";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {HeilbaumPhotoswipeModule} from "heilbaum-ionic-photoswipe";
import {InboxPageModule} from "../pages/inbox/inbox.module";
import {ChatPageModule} from "../pages/chat/chat.module";
import {ArenaPageModule} from "../pages/arena/arena.module";
import {NotificationPageModule} from "../pages/notification/notification.module";
import {InvitationsPageModule} from "../pages/invitations/invitations.module";
import {DatingPageModule} from "../pages/dating/dating.module";
import { Facebook } from '@ionic-native/facebook';
import { HttpClientModule } from '@angular/common/http';
import {Push} from "@ionic-native/push";


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ApiQuery,
        LoginPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        RecoveryPageModule,
        ContactPageModule,
        RegisterPageModule,
        SearchPageModule,
        ResultsPageModule,
        ProfilePageModule,
        HeilbaumPhotoswipeModule,
        InboxPageModule,
        ChatPageModule,
        ArenaPageModule,
        NotificationPageModule,
        InvitationsPageModule,
        DatingPageModule,
        PageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage
    ],
    providers: [
        Facebook,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiQuery,
        Camera,
        FileTransfer,
        ImagePicker,
        File,
        Push
    ]
})
export class AppModule {}
