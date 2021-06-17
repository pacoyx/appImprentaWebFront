import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { loginUsuario } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando = false;

  uiSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private authServis: AuthService,
    private router: Router) { }
 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['alex@itdata.com', [Validators.required, Validators.email]],
      password: ['123456']
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login(): void {

    const { email, password } = this.loginForm.value;

    this.store.dispatch(loginUsuario({ email, password }));

    this.uiSubscription = this.store.select('usuario').subscribe(resp => {

      if (resp.user) {
        console.log('login ok');
        this.router.navigate(['/']);

      }
    });
    // this.authServis.loginUsuario(email, password).subscribe(
    //   resp => {
    //     if (resp.estado === 'ok') {
    //       console.log('login ok');
    //       this.router.navigate(['/']);
    //     } else {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: resp.message,
    //       });
    //     }
    //   });

  }

  loginok(): void {
    const { email, password } = this.loginForm.value;
    this.authServis.loginUsuario(email, password).subscribe(
      resp => {
        if (resp.estado === 'ok') {
          console.log('login ok');
          this.router.navigate(['/']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resp.message,
          });
        }
      });

  }

}
