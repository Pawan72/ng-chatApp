import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { AngularFireList } from '@angular/fire/database';

import{ ChatMessage } from '../models/chat-Message.model'


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: any;
  chatMessages: AngularFireList<ChatMessage[]> ;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 
    this.afAuth.authState.subscribe(auth => {
      if(auth !== undefined && auth !== null){
        this.user = auth;
      }
    })
  }

  sendMessage(msg: string){
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessage();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email 
    });
  }

  getMessage(): AngularFireList<ChatMessage[]>
  {
    // query to create our message feed binding
    return this.db.list('messages', ref => {
      return ref.limitToLast(25).orderByKey();
    });
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                  (now.getUTCMonth() + 1) + '/' +
                  now.getUTCDate();
    
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return(date + " " + time);             
  }
}
