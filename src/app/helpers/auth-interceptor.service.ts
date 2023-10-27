import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { SpinnerService } from '../spinner/spinner.service';
import { MessageService } from '../services/message.service';
import { AlertService } from '../alerts/alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private spinner: SpinnerService,
    private message: MessageService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token') as string;
    const userIdAux: string = localStorage.getItem('userId') as string;
    let request = req;

    if (token||userIdAux) {
      request = req.clone({
        setHeaders: {
          authorization: token,
          userId: userIdAux
        }
      });
    }

    return next.handle(request).pipe(
      timeout(60000),
      catchError((err: HttpErrorResponse) => {
        this.handle(err);
        return throwError(err);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }


  handle(error: Error | HttpErrorResponse): void {
    this.spinner.hide();
    if (error instanceof TimeoutError) {
      this.message.setMessage = 'El tiempo de ejecución ha excedido el límite';
      this.router.navigate(['main-page'], { skipLocationChange: false });
      return;
    }
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      error.error.message
    ) {
      this.message.setMessage = 'Error';
      this.router.navigate(['error'], { skipLocationChange: true });
      return;
    }

    if (error instanceof Error) {
      switch (error.message) {
        default: {
          this.message.setMessage = 'Ha ocurrido un error desconocido.';
          this.router.navigate(['error'], { skipLocationChange: true });
          return;
        }
      }
    }

    // Generic HTTP errors
    switch (error.status) {
      case 400:
        switch (error.error) {
          case 'invalid_username_or_password': {
            this.message.setMessage = 'Usuario o contraseña inválidos';
            this.router.navigate(['error'], { skipLocationChange: true });
            return;
          }
          default: {
            this.message.setMessage = '[Bad Request] - Petición incorrecta';
            this.router.navigate(['error'], { skipLocationChange: true });
            return;
          }
        }


      case 401: {
        localStorage.clear();
        // unAuthorized
        this.alertService.error('No Autorizado', error.error.detail);
        this.router.navigateByUrl('/login');
        break;
        return;
      }
      case 403: {
        this.message.setMessage =
          'No tiene autorización para acceder al recurso solicitado.';
          this.alertService.error( this.message.setMessage, error.error.detail);

        return;
      }

      case 404: {
        this.message.setMessage = 'La URL es inválida.';
        this.router.navigate(['error'], { skipLocationChange: true });
        return;
      }
      case 422: {
        this.message.setMessage = 'Parece que se han proporcionado datos no válidos.';
        this.alertService.error( this.message.setMessage, error.error.detail);


        return;
      }
      case 500: {
          this.message.setMessage =
            'Algo salió mal, estamos trabajando para solucionarlo lo antes posible.';
            this.alertService.error( this.message.setMessage, error.error.detail);

        return;
      }
      case 501:
      case 502:
      case 503: {
        this.message.setMessage = 'El servicio solicitado no se encuentra disponible en este momento.';
        this.router.navigate(['error'], { skipLocationChange: true });
        return;
      }

      case -1: {
        this.message.setMessage =
          'Parece que no tienes conexión. Por favor, verifica tu conexión a Internet e intenta nuevamente.';
        this.router.navigate(['error'], { skipLocationChange: true });
        return;
      }
      case 0: {
        this.message.setMessage = 'El servicio que has solicitado no está disponible en este momento.';
        this.router.navigate(['error'], { skipLocationChange: true });
        return;
      }
      default: {
        this.message.setMessage = 'Ocurrió un error desconocido.';
        this.router.navigate(['error'], { skipLocationChange: true });
        return;
      }
    }
  }


}
