import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginRequestPayload } from '../shared/dto/login-request.payload';
import { RegisterRequestPayload } from '../shared/dto/register-request.payload';
import { User } from '../shared/model/User';
import { PlayService } from '../core/play.service';

@Injectable()
export class AuthService implements OnInit {
  token: boolean = false;
  users: User[];
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router,
    private client: HttpClient,
    private playService: PlayService
  ) {
    this.token = Boolean(localStorage.getItem('token'));
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
    this.users = this.playService.getUsers();
  }

  ngOnInit(): void {}

  login(loginPayload: LoginRequestPayload): Observable<LoginRequestPayload> {
    this.users = this.playService.getUsers();
    const user = this.users.find((u) => u.username === loginPayload.username) ?? this.users[0];
    localStorage.setItem('user', JSON.stringify(user));
    this.token = true;
    this.loggedIn.emit(true);
    this.userSubject.next(user);
    localStorage.setItem('token', String(this.token));
    this.router.navigate(['']);
    return of(loginPayload);
  }

  register(registerRequestPayload: RegisterRequestPayload): Observable<LoginRequestPayload> {
    const user = new User({ ...registerRequestPayload });
    const users = JSON.parse(localStorage.getItem('users'));
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    return of(user);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    this.userSubject.next(null);
    this.user = null;
    this.token = false;
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    return this.token;
  }

  isAuthorized(roles: string[]) {
    if (this.userValue) {
      return roles.indexOf(this.userValue.role) !== -1;
    } else if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      return roles.indexOf(user.role) !== -1;
    }
    return false;
  }

  getUserName() {
    return JSON.parse(localStorage.getItem('username'));
  }
}
