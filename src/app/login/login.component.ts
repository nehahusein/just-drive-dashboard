import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Router} from "@angular/router";

import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";

import { AngularFireAuth } from 'angularfire2/auth';




/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //
  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);
  hide = true;
  public loading = false;

  login: FormGroup;

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private fireAuth: AngularFireAuth) {
    //this.loading = true;
    this.login = new FormGroup ({
        email: new FormControl('',[Validators.email, Validators.required]),
        password: new FormControl('',Validators.required)
    })


  }

  ngOnInit() {
    //this.loading = false;
    const unsubscribe = this.fireAuth.auth.onAuthStateChanged(user => {
      //this.loading = false;
      if (!user) {
        console.log('no user')
        this.loading = false;
        //this.stopLoad();
        console.log(this.loading)
        //unsubscribe();
      } else {
      console.log('hmm')
      //this.loading = false;
      this.router.navigate(['home']);
        //unsubscribe();
      }

    });
    //this.loading = false;
  }

  stopLoad() {
    console.log('stopping')
    this.loading = false;
  }


  async onFormSubmit() {
    this.loading = true;
        if(this.login.valid) {
            console.log(this.login.value);
            try {
              console.log('trying')
              let signIn = await this.fireAuth.auth.signInWithEmailAndPassword(this.login.value.email, this.login.value.password);

              console.log('response')
              console.log(signIn);
              this.loading = false;
              this.router.navigate(['home']);
              // let alertInfo = {
              //   'title': 'Success!',
              //   'subtitle': 'Successful log in.'
              // };
              // this.alerts.presentBasicAlert(alertInfo);
              //this.navCtrl.setRoot('DrivePage');

            } catch (err) {
              if(err['code'] == 'auth/user-not-found') {
                let alertInfo = {
                  'title': 'Error',
                  'subtitle': 'No user with this email can be found.'
                };
                alert('No user with this email can be found.')
              } else if(err['code'] == 'auth/wrong-password') {
                let alertInfo = {
                  'title': 'Error',
                  'subtitle': 'Incorrect password.'
                };
                alert('Incorrect password')
                //this.alerts.presentBasicAlert(alertInfo);
              } else if (err['code'] == 'auth/user-disabled') {
                let alertInfo = {
                  'title': 'Error',
                  'subtitle': 'This user has been disabled.'
                };
                alert('This user has been disabled.')
                //this.alerts.presentBasicAlert(alertInfo);
              } else if(err['code'] == 'auth/invalid-email') {
                let alertInfo = {
                  'title': 'Error',
                  'subtitle': 'Invalid email.'
                };
                alert('Invalid email')
                //this.alerts.presentBasicAlert(alertInfo);
              } else {
                let alertInfo = {
                  'title': 'Error',
                  'subtitle': 'Trouble logging in.'
                };
                alert('Trouble logging in')
                //this.alerts.presentBasicAlert(alertInfo);
              }
              console.log(err);
            }
        }
    }




}
