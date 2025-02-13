import { CommonModule } from '@angular/common';
import { Component, ModelSignal, model, effect, inject, InputSignal, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { confirmActionModal, View } from 'src/app/_models/base/types';
import Clinic from 'src/app/_models/clinics/clinic';
import ClinicFiltersForm from 'src/app/_models/clinics/clinicFiltersForm';
import ClinicForm from 'src/app/_models/clinics/clinicForm';
import ClinicParams from 'src/app/_models/clinics/clinicParams';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Photo } from 'src/app/_models/forms/example/_models/photo';
import { FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { PhotoShape, PhotoSize } from 'src/app/_models/photos/photoTypes';
import { SiteSection } from 'src/app/_models/sections/sectionTypes';
import { ConfirmService } from 'src/app/_services/confirm/confirm.service';
import { ImageHandlerService } from 'src/app/_services/image-handler.service';
import { ImageSelectorComponent } from 'src/app/_shared/components/image-selector.component';
import { ImageThumbnailSelectorComponent } from 'src/app/_shared/components/image-thumbnail-selector.component';
import { ClinicsService } from 'src/app/clinics/clinics.config';


@Component({
  selector: "[clinicForm]",
  templateUrl: './clinic-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    ImageSelectorComponent,
    ImageThumbnailSelectorComponent,
  ]
})
export class ClinicFormComponent
  extends BaseForm<Clinic, ClinicParams, ClinicFiltersForm, ClinicForm, ClinicsService>
  implements FormInputSignals<Clinic>
{
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  readonly imageHandler: ImageHandlerService = inject(ImageHandlerService);
  private confirmService: ConfirmService = inject(ConfirmService);

  item: ModelSignal<Clinic | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  readonly fromWrapper = signal(false);

  constructor() {
    super(ClinicsService, ClinicForm);

    console.log('ClinicFormComponent constructor', this.form);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
      ;

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }

  ngOnInit(): void {
    this.initializeImages();
  }

  private initializeImages(): void {
    const initialPhotos: Photo[] = this.item()?.photos?.map((p: Photo) => ({
      id: p.id,
      url: p.url,
      isMain: p.isMain
    })) || [];
    this.imageHandler.initialize(initialPhotos);
  }

  hasRealImages(): boolean {
    return this.imageHandler.getImages().some((img: Photo) => !!img.url || !!img.file);
  }

override async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    const formData = new FormData();
    formData.append('mainImageIndex', this.imageHandler.getMainImageIndex().toString());

    const removedIds: string[] = this.imageHandler.getRemovedIds();
    removedIds.forEach((id: string) => formData.append('removedImageIds', id));

    this.imageHandler.getImages()
      .filter((image: Photo) => image.file)
      .forEach((image: Photo) => formData.append('files', image.file!));

    const clinicData: any = this.form.payload;
    Object.keys(clinicData).forEach((key: string) => {
      const value: any = clinicData[key as keyof typeof clinicData];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Clinic> = isNew
      ? this.service.create(this.form, this.view(), { use: this.use(), value: formData, })
      : this.service.update(this.form, this.view(), { use: this.use(), value: formData, id: this.form.controls.id.value ?? undefined, });

    observable.subscribe({
      next: (clinic) => {
        console.log(isNew ? 'Created:' : 'Updated:', clinic);
        this.toastr.success(`Clinico ${isNew ? 'creado' : 'actualizado'} exitosamente`);
      },
      error: (error: BadRequest) => {
        console.error(`Error ${isNew ? 'creating' : 'updating'} clinic:`, error);
        this.form.error = error;
        this.toastr.error(`Error ${isNew ? 'creando' : 'actualizando'} el clinico`);
      }
    });
  }
}
