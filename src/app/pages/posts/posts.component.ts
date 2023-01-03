import { Component , OnInit} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{

    constructor(public userService: UserService, private router:Router, private storage:AngularFireStorage){

    }
    //upon initialization of component/ constructor run the below, if the user property in services is null means user hasnt logged in
  ngOnInit(): void {
    if (this.userService.user = undefined || this.userService.user == null){
      this.router.navigate(['/login']);
      let str = localStorage.getItem('user');
      if(str != null){
        this.userService.user = JSON.parse(str);
      }
      else{
        this.router.navigate(['/login']);
      }
    }
  }

  selectedFile:any;

  posts:Array<any> = [];
  commentText:Array<string> = [];

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  post(){
    if(this.selectedFile != undefined || this.selectedFile != null){
      this.uploadImage().then((imageURL)=>{
        console.log(imageURL);
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  // post(){
  //   this.snackbar.open('Creating the post...', '', {duration:15000});
  //   if(this.selectedFile != undefined || this.selectedFile != null){
  //     this.uploadImage().then((imageURL)=>{
  //       console.log(imageURL);
  //       let postObj = {
  //         username: this.userService.user.username,
  //         text : this.text,
  //         imageURL: imageURL,
  //         likes: [],
  //         comments:[]
  //       };
  //       this.posts.push(postObj);
  //       this.postService.saveNewPost(postObj).then((res)=>{
  //         console.log(res);
  //         this.snackbar.open('Posted successfully', 'ok');
  //       }).catch((err)=>{
  //         console.log(err);
  //       });
  //       this.selectedFile = undefined;

  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  //   }
  //   else{
  //     let postObj = {
  //       username: this.userService.user.username,
  //       text : this.text,
  //       imageURL: '',
  //       likes: [],
  //       comments:[]
  //     };
  //     this.posts.push(postObj);
  //     this.postService.saveNewPost(postObj).then((res)=>{
  //       console.log(res);
  //       this.snackbar.open('Posted successfully', 'ok');
  //     }).catch((err)=>{
  //       console.log(err);
  //     });
  //   }
  // }


  uploadImage() {
    return new Promise((resolve, reject) => {
      let n = Date.now();
      const file = this.selectedFile;
      const filePath = `images/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`images/${n}`, file);
      task.snapshotChanges().pipe(
        finalize(() => {
          let imageURL = fileRef.getDownloadURL();
          imageURL.subscribe((url: any) => {
            if (url) {
              console.log(url);
              resolve(url);
            }
          });
        })
      ).subscribe(
        (url)=>{
          if(url){
            console.log(url);
          }
        }
      );
    });
  }


  postSchema = {
    username :'',
    imageURL:'',
    text:'',
    likes:[],
    comments:[{username:'', comment:''}]
  }



}
