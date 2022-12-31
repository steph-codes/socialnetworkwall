import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  constructor(public userService:UserService, private router:Router) {

  }

  logout(){
    this.userService.user = undefined;
    this.router.navigate(['/login']);

  }
}
