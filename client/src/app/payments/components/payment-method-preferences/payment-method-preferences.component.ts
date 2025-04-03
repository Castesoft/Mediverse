import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { IconsService } from 'src/app/_services/icons.service';
import { AccountService } from 'src/app/_services/account.service';
import { PaymentsService } from 'src/app/payments/payments.config';
import { PaymentMethodPreference, PaymentMethodPreferenceDto } from '../../models/payment-method-preference.model';
import { PaymentMethodType } from 'src/app/_models/paymentMethodTypes/paymentMethodType';
import { Account } from 'src/app/_models/account/account';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  selector: 'app-payment-method-preferences',
  templateUrl: './payment-method-preferences.component.html',
  styleUrls: [ './payment-method-preferences.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    AlertComponent,
    FaIconComponent
  ]
})
export class PaymentMethodPreferencesComponent implements OnInit {
  private readonly paymentsService: PaymentsService = inject(PaymentsService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly library: FaIconLibrary = inject(FaIconLibrary);

  protected readonly iconsService: IconsService = inject(IconsService);

  preferences: PaymentMethodPreferenceDto[] = [];
  availablePaymentMethods: PaymentMethodType[] = [];
  currentAccount: Account | null = null;

  isLoading: boolean = false;
  saveError: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.library.addIcons(faGripVertical);
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.currentAccount = this.accountService.current();
    if (this.currentAccount?.id) {
      this.loadAvailablePaymentMethods();
      this.loadPaymentMethodPreferences(this.currentAccount.id);
    } else {
      console.error("User account not found.");
      this.saveError = true;
      this.errorMessage = 'No se pudo cargar la información del usuario.';
    }
  }

  private loadPaymentMethodPreferences(userId: number): void {
    this.isLoading = true;
    this.paymentsService.getPaymentMethodPreferences(userId).subscribe({
      next: (preferences) => {

        this.preferences = preferences.map(pref => ({
          ...pref,
          isActive: pref.isActive ?? true
        }));
        this.sortAndReorderPreferences(false);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading payment method preferences:', error);
        this.isLoading = false;
        this.saveError = true;
        this.errorMessage = 'Error al cargar las preferencias de métodos de pago.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private loadAvailablePaymentMethods(): void {

    this.paymentsService.getAllMethods().subscribe({
      next: (methods) => {
        this.availablePaymentMethods = methods;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading available payment methods:', error);

      }
    });
  }

  /**
   * Sorts preferences: Active first, then by displayOrder.
   * Updates displayOrder based on the new sorted position.
   * Optionally triggers savePreferences.
   */
  private sortAndReorderPreferences(save: boolean = true): void {

    this.preferences.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });


    this.preferences.forEach((pref, index) => {
      pref.displayOrder = index + 1;
    });


    this.ensureSingleDefault();

    if (save) {
      this.savePreferences();
    }

    this.preferences = [ ...this.preferences ];
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Ensures only one active payment method is marked as default.
   * Prefers the lowest displayOrder active method if multiple are marked.
   * If no active method is default, makes the first active one default.
   */
  private ensureSingleDefault(): void {
    const activePreferences = this.preferences.filter(p => p.isActive);
    if (activePreferences.length === 0) {

      this.preferences.forEach(p => p.isDefault = false);
      return;
    }

    let defaultFound = false;
    let firstActivePref: PaymentMethodPreferenceDto | null = null;


    this.preferences.forEach(p => {
      if (p.isActive) {
        if (firstActivePref === null) {
          firstActivePref = p;
        }
        if (p.isDefault) {
          if (!defaultFound) {
            defaultFound = true;
          } else {
            p.isDefault = false;
          }
        }
      } else {

        p.isDefault = false;
      }
    });


    if (!defaultFound && firstActivePref) {
      (firstActivePref as PaymentMethodPreferenceDto).isDefault = true;
    }
  }


  onDrop(event: CdkDragDrop<PaymentMethodPreferenceDto[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reorderedPreferences = [ ...this.preferences ];
    moveItemInArray(reorderedPreferences, event.previousIndex, event.currentIndex);

    const draggedItem = reorderedPreferences[event.currentIndex];
    const itemBefore = event.currentIndex > 0 ? reorderedPreferences[event.currentIndex - 1] : null;
    const itemAfter = event.currentIndex < reorderedPreferences.length - 1 ? reorderedPreferences[event.currentIndex + 1] : null;

    const isDraggedActive = draggedItem.isActive;
    const isBeforeActive = itemBefore?.isActive ?? isDraggedActive;
    const isAfterActive = itemAfter?.isActive ?? isDraggedActive;

    if ((itemBefore !== null && isDraggedActive !== isBeforeActive) || (itemAfter !== null && isDraggedActive !== isAfterActive)) {
      console.warn("Cannot drag items between active and inactive groups. Use the toggle switch.");
      return;
    }

    moveItemInArray(this.preferences, event.previousIndex, event.currentIndex);

    this.preferences.forEach((pref, index) => {
      pref.displayOrder = index + 1;
    });

    this.savePreferences();
  }

  toggleDefault(preference: PaymentMethodPreferenceDto): void {
    if (!preference.isActive) {
      return;
    }

    preference.isDefault = true;

    this.preferences.forEach(p => {
      if (p.paymentMethodTypeId !== preference.paymentMethodTypeId) {
        p.isDefault = false;
      }
    });

    this.savePreferences();
  }

  toggleActive(preference: PaymentMethodPreferenceDto): void {
    preference.isActive = !preference.isActive;

    if (!preference.isActive && preference.isDefault) {
      preference.isDefault = false;

    }

    this.sortAndReorderPreferences(true);
  }

  private savePreferences(): void {
    if (!this.currentAccount?.id) return;

    this.isLoading = true;
    this.saveError = false;
    this.changeDetectorRef.detectChanges();


    const preferencesToUpdate = this.preferences.map(pref => ({
      paymentMethodTypeId: pref.paymentMethodTypeId,
      displayOrder: pref.displayOrder,
      isDefault: pref.isDefault,
      isActive: pref.isActive
    }));

    const saveOperations = preferencesToUpdate.map(prefData =>
      this.paymentsService.updatePaymentMethodPreference(
        this.currentAccount!.id!,
        prefData.paymentMethodTypeId,
        {
          displayOrder: prefData.displayOrder,
          isDefault: prefData.isDefault,
          isActive: prefData.isActive
        }
      ).toPromise()
    );

    Promise.all(saveOperations)
      .then(() => {
        console.log('Preferences saved successfully.');
        this.isLoading = false;

      })
      .catch(error => {
        console.error('Error saving preferences:', error);
        this.isLoading = false;
        this.saveError = true;
        this.errorMessage = 'Error al guardar una o más preferencias. Intenta de nuevo.';


      })
      .finally(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  addPaymentMethod(methodId: number | null): void {
    if (!this.currentAccount?.id || methodId === null || this.isLoading) return;


    const methodToAdd = this.availablePaymentMethods.find(m => m.id === methodId);
    if (!methodToAdd) {
      console.error("Selected method details not found.");
      this.saveError = true;
      this.errorMessage = 'Error al encontrar detalles del método de pago.';
      return;
    }

    this.isLoading = true;
    this.saveError = false;
    this.changeDetectorRef.detectChanges();

    const isActive = true;
    const isDefault = !this.preferences.some(p => p.isActive && p.isDefault);

    const lastActiveIndex = this.preferences.reduce((maxIndex, p, currentIndex) =>
      (p.isActive ? Math.max(maxIndex, currentIndex) : maxIndex), -1);
    const displayOrder = lastActiveIndex === -1 ? 1 : this.preferences[lastActiveIndex].displayOrder + 1;

    const newPreferenceData: PaymentMethodPreference = {
      userId: this.currentAccount.id,
      paymentMethodTypeId: methodId,
      displayOrder: displayOrder,
      isDefault: isDefault,
      isActive: isActive
    };

    this.paymentsService.savePaymentMethodPreference(newPreferenceData).subscribe({
      next: (savedPreferenceDto) => {


        this.preferences.push({
          ...savedPreferenceDto,

          paymentMethodTypeName: methodToAdd.name || undefined,

          isActive: savedPreferenceDto.isActive ?? isActive,
          isDefault: savedPreferenceDto.isDefault ?? isDefault,
        });


        this.sortAndReorderPreferences(false);

        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error adding payment method preference:', error);
        this.isLoading = false;
        this.saveError = true;
        this.errorMessage = 'Error al agregar el método de pago.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getAvailableMethodsToAdd(): PaymentMethodType[] {
    const preferredIds = new Set(this.preferences.map(p => p.paymentMethodTypeId));
    return this.availablePaymentMethods.filter(m => m.id !== null && !preferredIds.has(m.id));
  }

  isMethodInPreferences(methodId: number | null): boolean {
    if (methodId === null) return false;
    return this.preferences.some(p => p.paymentMethodTypeId === methodId);
  }

  getPaymentMethodName(methodId: number): string {
    const method = this.availablePaymentMethods.find(m => m.id === methodId);
    return method?.name || 'Método Desconocido';
  }

  getPaymentMethodIcon(methodId: number): [ string, string ] {
    const method = this.availablePaymentMethods.find(m => m.id === methodId);
    const prefix = method?.iconPrefix || 'fas';
    const iconName = method?.iconName || 'credit-card';

    return [ prefix, iconName ];
  }
}
