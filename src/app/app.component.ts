import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'music';

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDFLMYIJtGwbRvBk2U-_jAvCQN3yz_rZxY',
      authDomain: 'music-67f89.firebaseapp.com',
      databaseURL: 'https://music-67f89-default-rtdb.firebaseio.com',
      projectId: 'music-67f89',
      storageBucket: 'music-67f89.appspot.com',
      messagingSenderId: '448259843272',
      appId: '1:448259843272:web:2c44ff1ac9b3f8d03671fd'
    };
    firebase.initializeApp(firebaseConfig);
  }

}
