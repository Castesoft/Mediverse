import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationRealtimeService {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly baseUrl: string = environment.hubUrl;

  private hubConnection: signalR.HubConnection | undefined;
  private notificationSubject: BehaviorSubject<Notification | null> = new BehaviorSubject<Notification | null>(null);
  private isInitialized: boolean = false;

  public init(): void {
    if (this.isInitialized) {
      return;
    }
    this.startConnection();
    this.registerOnServerEvents();
    this.isInitialized = true;
  }

  private startConnection(): void {
    const token: string = this.accountService.current()?.token || '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}notifications`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started.'))
      .catch((err: any) => console.error('Error while starting connection: ', err));
  }

  private registerOnServerEvents(): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('Notification received:', notification);
      this.notificationSubject.next(notification);
      this.playSound();
    });
  }

  private playSound(): void {
    const audio = new Audio('assets/notification.mp3');
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }

  public getNotification(): Observable<Notification | null> {
    if (!this.isInitialized) {
      this.init();
    }
    return this.notificationSubject.asObservable();
  }
}
