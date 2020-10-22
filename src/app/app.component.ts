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

  constructor(private auth: AngularFireAuth) {}

  public login(): void {
    const provider = new auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'consent',
      tenant: '6e80d0d2-c049-4101-ad8d-8fd678b61299',
    });

    this.auth.signInWithRedirect(provider);
  }

  public logout(): void {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.auth.user.subscribe(u => {
      console.log(u);
    });
  }
}
