import { Component , OnInit} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { PostService } from 'src/app/Services/post.service';
import {finalize} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{

    constructor(public userService:UserService, private router:Router, private storage:AngularFireStorage, public postService:PostService,private snackbar:MatSnackBar){

    }
    //upon initialization of component/ constructor run the below, if the user property in services is null means user hasnt logged in
  ngOnInit(): void {
    if (this.userService.user == undefined || this.userService.user == null){

      let str = localStorage.getItem('user');
      if(str != null){
        this.userService.user = JSON.parse(str);
      }
      else{
        this.router.navigate(['/login']);
      }
    }

    this.postService.getPosts().then((res:any)=>{
      this.posts = res;
      for(let post of this.posts){
        this.commentText.push("");
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  selectedFile:any;

  text= "";

  posts:Array<any> = [];
  commentText:Array<string> = [];

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }


  post(){
    this.snackbar.open('Creating the post...', '', {duration:15000});
    if(this.selectedFile != undefined || this.selectedFile != null){
      this.uploadImage().then((imageURL)=>{
        console.log(imageURL);
        //imageUrl created then create the postObj and push into array
        let postObj = {
          username: this.userService.user.username,
          text : this.text,
          imageURL: imageURL,
          likes: [],
          comments:[]
        };
        console.log(this.userService.user.username);
        this.posts.push(postObj);
        this.postService.saveNewPost(postObj).then((res)=>{
          console.log(res);
          this.snackbar.open('Posted successfully', 'ok');
        }).catch((err)=>{
          console.log(err);
        });
        this.selectedFile = undefined;

      }).catch((err)=>{
        console.log(err);
      })
    }
    else{
      let postObj = {
        username: this.userService.user.username,
        text : this.text,
        imageURL: '',
        likes: [],
        comments:[]
      };
      //push postObj intonthe array variable
      this.posts.push(postObj);
      this.postService.saveNewPost(postObj).then((res)=>{
        console.log(res);
        this.snackbar.open('Posted successfully', 'ok');
      }).catch((err)=>{
        console.log(err);
      });
    }
  }

  like(postId:any){
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].id == postId){
        if(this.posts[i].likes.indexOf(this.userService.user.id) >= 0){
          // splice removes the userid from the likes array
          this.posts[i].likes.splice(this.posts[i].likes.indexOf(this.userService.user.id), 1);
        }
        else{
          this.posts[i].likes.push(this.userService.user.id);
        }
        this.postService.updateLikes(this.posts[i]).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      }
    }
  }
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

  comment(postId:any, commentIndex:any){
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].id == postId){
        let commentObj = {
          username: this.userService.user.username,
          comment: this.commentText[commentIndex]
        };
        this.posts[i].comments.push(commentObj);
        this.commentText[commentIndex] = "";
        this.postService.updateComments(this.posts[i]);
      }
    }
  }

  postSchema = {
    username :'',
    imageURL:'',
    text:'',
    likes:[],
    comments:[{username:'', comment:''}]
  }


}
