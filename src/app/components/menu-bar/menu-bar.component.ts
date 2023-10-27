import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../auth/services/auth.service";
import {SpinnerService} from "../../spinner/spinner.service";
import {AuthenticationResponse} from "../../auth/interface/authentication-response";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements  OnInit{
  navbarOpen = false;
  usuarioId = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: SpinnerService,
  ) {
    this.onInitGetUser();

  }

  ngOnInit(): void {
    this.navbarOpen = false;
    this.onInitGetUser();

  }
 onInitGetUser(){
    const id = (localStorage.getItem('userId'));
    if(id){
      this.usuarioId = localStorage.getItem('userId')!;
    }
  }
  onLogout(){
    this.spinner.show();
    this.usuarioId='';
    this.authService.logout();
    this.router.navigateByUrl('/');
    this.spinner.hide();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
