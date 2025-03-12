import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from "ngx-toastr";
import { Notification } from "src/app/_models/notifications/notification";
import { NotificationsService } from "src/app/notifications/notifications.config";

@Injectable({
  providedIn: 'root'
})
export class NotificationRealtimeService {
  private readonly notificationsService: NotificationsService = inject(NotificationsService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly toastr: ToastrService = inject(ToastrService);
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
      .then(() => {})
      .catch((err: any) => console.error('Error while starting connection: ', err));
  }

  private registerOnServerEvents(): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('Notification received:', notification);
      this.notificationSubject.next(notification);
      this.notificationsService.serverUpdate.next();
      this.toastr.info(notification.message, notification.title, {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true
      });
      this.playSound();
    });
  }

  private playSound(): void {
    const audio = new Audio('media/audio/notification-2-202503.mp3');
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
