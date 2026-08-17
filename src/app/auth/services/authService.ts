import { computed, effect, inject, Service, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { tap, Observable, map, catchError, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl

@Service()
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  tokenEffect = effect(() => console.log("token desde el service", this._token()))

  private http = inject(HttpClient);

  //Con esto generamos un resource al levantar el servicio que
  // comprueba si el usuario está autenticado
  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

  //computed signals son solo de lectura, por lo que no se pueden modificar
  // desde fuera
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  //estos metodos los usamos como getters para que no puedan modificar los user y token "reales" desde el exterior
  user = computed(() => this._user());
  token = computed(() => this._token())
  //para los post primero la url del endpoint y despues la data
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      //el tap es para disparar efectos secundarios a un observable
      map(resp => this.handleAuthSuccess(resp)),
      //manejamos los errores
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }).pipe(
      //el tap es para disparar efectos secundarios a un observable
      map(resp => this.handleAuthSuccess(resp)),
      //manejamos los errores
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');

    // TODO: acordarse de limpiar el local storage
    // localStorage.removeItem('teken');
  }

  // private handleAuthSuccess(resp: AuthResponse) {
  //   this._user.set(resp.user);
  //       this._authStatus.set('authenticated');
  //       this._token.set(resp.token);

  //       localStorage.setItem('token', resp.token);
  // }

  //esto es lo mismo que arriba
  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);
    return true
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false)
  }


}
