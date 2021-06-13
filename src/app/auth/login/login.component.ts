import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authServis: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['alex@itdata.com', [Validators.required, Validators.email]],
      password: ['123456']
    });
  }

  login(): void {
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
