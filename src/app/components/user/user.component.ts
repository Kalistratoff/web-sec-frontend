import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PostsService } from "../../services/posts.service";
import { AccountService } from "../../services/account.service";
import { AlertService } from "../../services/alert-service.service";

import { Post } from './../../models/postModel';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [
    PostsService,
    AccountService,
    AlertService
  ]
})
export class UserComponent implements OnInit {

  isMe: boolean;
  showSettings: boolean;
  username: string;
  user_avatar: string;
  user_posts: Post[];
  user_friends: any[];
  user_details: any;
  user_preferences: {};
  privacy_settings: any[];

  /*
    1.0 MB (1024 Kilobyte) = 1048576
    0.5 MB (512 Kilobyte)  = 524288
  */
  AVATAR_MAX_SIZE = 1048576;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _postService: PostsService,
    private _accountService: AccountService,
    private _alert: AlertService,
  ) {

     

    this.privacy_settings = [
      {
        type: 1,
        name: "Public"
      },
      {
        type: 2,
        name: "Friends"
      },
      {
        type: 3,
        name: "Private"
      }
    ];

    this.user_preferences = this.privacy_settings[0];

   
  }

  ngOnInit() {

    this.user_avatar = "assets/images/user-default.png";

    // GET USER NAME FROM URL PARAMS
    this._route.params
      .map(params => params['username'])
      .subscribe(username_url_param => {
        this.username = username_url_param;
        this.isMe = username_url_param === 'me';
        this._loadUserData(this.username);
      });
  }

  goToFriendProfle(username: string) {
    this._router.navigate([`user/${username}`]);
  }
  //----------------------------------------------------------------------------

  updateUserSettings(): void {
    this._accountService.updateUserPreferences([this.user_preferences])
      .then((response) => {
            this._alert.success("Success", "Settings are update! \n👨‍💻");
            this.showSettings = false;
          })
          .catch((err) => {
            this._alert.error("💩 happens....", "Unfortunately you settings are not updated! \nPlease try again!");
            this.showSettings = false;
          });
  }

  //----------------------------------------------------------------------------

  pictureUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileInfo = event.target.files[0];

      // CHECK IMAGE SIZE
      if (fileInfo.size > this.AVATAR_MAX_SIZE) {
        this._alert.error("WOW MAN!", "THE SELECTED IMAGE IS TOOOO BIG....\nMAX ALLOWED SIZE IS 1 MB!");
        return;
      }

      console.log('file type');
      console.log(fileInfo);
      // CHECK FILE TYPE
      if(!fileInfo.type.includes('image') ){
        this._alert.error("NOT IMAGE!", "Ai ai ai.....");
        return;
      }
      else{
        console.log('OK IMAGE TYPE');
      }

      reader.onload = (event: any) => {
        let imageAsBase64 = event.target.result;
        // @TODO => API CALL => SAVE IMAGE
        this._accountService.uploadPRofilePicture(imageAsBase64)
          .then((response) => {
            this.user_avatar = imageAsBase64;
            this._alert.success("Success", "Wow your avatar looks great! \nThe Picture is successfully saved!");
          })
          .catch((err) => {
            this._alert.error("What a sad, sad day 😢", "Unfortunately you picture is not saved! \nPlease try again!");
          });

      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }
  //----------------------------------------------------------------------------
  showUserSettings(): void {
    this.showSettings = !this.showSettings;
  }

  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  // PRIVATE FUNCTION ----------------------------------------------------------
  //----------------------------------------------------------------------------


  _loadUserData(username: string) {
    // GET USER DETAILS
    this._getUserDetails(username);
    // GET USER POSTS
    this._getUserPosts(username);
    // GET USER PREFERENCES
    this._getUserPreferences(username);
    // GET FRIENDS
    this._getFriends();
  }
  //----------------------------------------------------------------------------
  _getUserDetails(username: string): any {

    // _accountService get details call
    // this.user_details = response
    // this.user_avatar = picture.from.server
  }
  //----------------------------------------------------------------------------
  _getUserPosts(username: string): any {
    // _accountService get userPosts call
    this.user_posts = this._postService.getDummyPosts(5);
  }
  //----------------------------------------------------------------------------
  _getUserPreferences(username: string): any {
    // _accountService get userPreferences call
    // this.user_preferences = response
  }
  //----------------------------------------------------------------------------
  _getFriends(): any {
    this.user_friends = this._accountService.getFriends(25);
  }
}
