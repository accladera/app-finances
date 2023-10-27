import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private message!: string;
  constructor() {}
  get getMassage(): string{
    return this.message;
  }
  set setMessage(message: string) {
    this.message = message;
  }}
