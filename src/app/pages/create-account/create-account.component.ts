import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {

    constructor(private fb:FormBuilder, public userService:UserService){

    }

    createAccountForm = this.fb.group({
      email : ['',[Validators.required, Validators.email]],
      username : ['',[Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    create(){
      //console.log(this.createAccountForm.value);
      this.userService.createNewUser(this.createAccountForm.value).then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      });
    }

    
}
