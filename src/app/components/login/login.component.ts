import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../spinner/spinner.service";
import {Router} from "@angular/router";
import {AlertService} from "../../alerts/alert.service";
import {AuthService} from "../../auth/services/auth.service";
import {SessionService} from "../../services/session.service";
import {AuthenticationRequest} from "../../auth/interface/authentication-request";
import {enumAlertText} from "../../enums/enumAlertText";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({});
  nextRoute = '/finanzas';
  username = '';
  password = '';
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  passwordType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: SpinnerService,
    private alert: AlertService,
    private sessionService: SessionService
  ) {
    this.createForm();
  }

  createForm(): void {
    this.formLogin = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    if (this.formLogin.invalid) {
      this.alert.warning(enumAlertText.requiredFields, enumAlertText.formTitle);
      this.formLogin.markAllAsTouched();
      return
    }
    this.spinner.show();
    const user: AuthenticationRequest = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    };

    this.authService.login(user).subscribe(
      {
        next: (res) => {
          console.log(res);
          if (res) {
            if(res.id){
            this.username = '';
            this.password = '';
            this.spinner.hide();          
          this.formLogin.reset();
          this.alert.success('Inicio de sesión exitoso.','');

          this.router.navigate([this.nextRoute]);
          } else {
            //this.alert.error(enumAlertText.errorSubmit, enumAlertText.noAuthorized);
            this.username = '';
            this.password = '';
            this.spinner.hide();
          this.formLogin.reset();
          } }
        },
        error: err => {
          console.log(err);
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.noAuthorized);
          this.username = '';
          this.password = '';
          this.spinner.hide();
          this.formLogin.reset();
        }
      } 
      );
  }
  register():void{

    if (this.formLogin.invalid) {
      this.alert.warning(enumAlertText.requiredFields, enumAlertText.formTitle);
      this.formLogin.markAllAsTouched();
      return
    }
    this.spinner.show();
    const user: AuthenticationRequest = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    };
     this.authService.register(user).subscribe(
      {
        next: (res) => {
          if (res ) {
            this.username = '';
            this.password = '';
            this.spinner.hide();
            
          this.formLogin.reset();
            //this.router.navigate([this.nextRoute]);
            this.alert.success('Se registro correctamente, ahora inicie sesión.','');
          } else {
            this.alert.error(enumAlertText.errorSubmit, enumAlertText.noAuthorized);
            this.username = '';
            this.password = '';
            this.spinner.hide();
            
          this.formLogin.reset();
          }
        },
        error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.noAuthorized);
          this.username = '';
          this.password = '';
          this.spinner.hide();
          this.formLogin.reset();
        }
      }
     );
  }
  viewPassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }
}
