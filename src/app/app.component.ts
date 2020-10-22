import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'digizuite-ps-qa';

  constructor(private fireAuth: AngularFireAuth) {}

  public login(): void {
    const provider = new auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'consent',
      tenant: '6e80d0d2-c049-4101-ad8d-8fd678b61299',
    });

    this.fireAuth.signInWithRedirect(provider);
  }

  public logout(): void {
    this.fireAuth.signOut();
  }

  ngOnInit(): void {
    this.fireAuth.user.subscribe(u => {
      console.log(u);
    });
  }
}
