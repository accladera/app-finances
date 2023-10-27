import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css']
})
export class PageErrorComponent {
  mesg?: string;
  constructor(private router: Router, private message: MessageService) {}

  ngOnInit(): void {
    this.mesg = this.message.getMassage;
  }
  backToHome(): void {

    this.router.navigateByUrl('/main-page');
  }
}
