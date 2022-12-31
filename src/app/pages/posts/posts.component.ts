import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{

    constructor(public userService: UserService, private router:Router){

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




}
