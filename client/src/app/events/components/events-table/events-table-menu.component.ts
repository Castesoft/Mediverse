import { Component, inject, input, InputSignal, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { EventsService } from "src/app/events/events.service";
import { ITableMenu } from "src/app/_models/tables/interfaces/tableComponentInterfaces";
import Event from "src/app/_models/events/event";
import {
  ConfirmationDialogData,
  ConfirmationModalComponent
} from "src/app/_shared/components/confirmation-modal/confirmation-modal.component";
import { filter, take } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'div[eventsTableMenu]',
  templateUrl: './events-table-menu.component.html',
  standalone: true,
  imports: [ RouterModule, CdkModule, MaterialModule ],
})
export class EventsTableMenuComponent extends TableMenuComponent<Event, any, any, EventsService> implements ITableMenu<Event> {
  override item: ModelSignal<Event> = model.required();
  override key: InputSignal<string> = input.required();

  private readonly toastr: ToastrService = inject(ToastrService);

  constructor() {
    super();
  }

  openCancelConfirmation(): void {
    const event = this.item();
    if (!event || !event.id) {
      console.error('Cannot cancel event without a valid event object:', event);
      this.toastr.warning('No se puede cancelar la cita en este momento.');
      return;
    }

    const eventId = event.id;

    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Cancelación',
      message: `¿Estás seguro de que deseas cancelar la cita #${eventId}? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, Cancelar',
      confirmButtonColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().pipe(filter(result => result === true), take(1)).subscribe(() => {
      this.service().cancelEvent(eventId)
        .pipe(take(1))
        .subscribe({
          next: (updatedEvent: Event) => {
            console.log('Event cancelled successfully:', updatedEvent);

            this.toastr.success(`Cita #${eventId} cancelada exitosamente.`);
          },
          error: (err: any) => {
            console.error('Error cancelling event:', err);
            this.toastr.error('Error al cancelar la cita. Intente de nuevo.');
          }
        });
    });
  }
}
