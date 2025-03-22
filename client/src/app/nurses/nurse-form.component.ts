import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, InputSignal, model, ModelSignal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { confirmActionModal, View } from 'src/app/_models/base/types';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Photo } from 'src/app/_models/forms/example/_models/photo';
import { FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import Nurse from 'src/app/_models/nurses/nurse';
import { NurseFiltersForm } from 'src/app/_models/nurses/nurseFiltersForm';
import { NurseForm } from 'src/app/_models/nurses/nurseForm';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';
import { PhotoShape, PhotoSize } from 'src/app/_models/photos/photoTypes';
import { SiteSection } from 'src/app/_models/sections/sectionTypes';
import { ConfirmService } from 'src/app/_services/confirm/confirm.service';
import { ImageHandlerService } from 'src/app/_services/image-handler.service';
import { ImageThumbnailSelectorComponent } from 'src/app/_shared/components/image-thumbnail-selector.component';
import { NursesService } from 'src/app/nurses/nurses.config';


@Component({
  selector: '[nurseForm]',
  templateUrl: './nurse-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    ImageThumbnailSelectorComponent,
  ],
})
export class NurseFormComponent
  extends BaseForm<Nurse, NurseParams, NurseFiltersForm, NurseForm, NursesService>
  implements FormInputSignals<Nurse> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  readonly imageHandler: ImageHandlerService = inject(ImageHandlerService);
  private confirmService: ConfirmService = inject(ConfirmService);

  item: ModelSignal<Nurse | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  readonly fromWrapper = signal(false);

  constructor() {
    super(NursesService, NurseForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

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

    const nurseData: any = this.form.payload;
    Object.keys(nurseData).forEach((key: string) => {
      const value: any = nurseData[key as keyof typeof nurseData];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formData.set('dateOfBirth', this.form.controls.dateOfBirth.value?.toISOString() || '');
    formData.set('sex', this.form.controls.sex.getRawValue()?.name || '');

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Nurse> = isNew
      ? this.service.create(this.form, { use: this.use(), value: formData, })
      : this.service.update(this.form, {
        use: this.use(),
        value: formData,
        id: this.form.controls.id.value ?? undefined,
      });

    observable.subscribe({
      next: (nurse) => {
        console.log(isNew ? 'Created:' : 'Updated:', nurse);
        this.toastr.success(`Especialista ${isNew ? 'creado' : 'actualizado'} exitosamente`);
      },
      error: (error: BadRequest) => {
        console.error(`Error ${isNew ? 'creating' : 'updating'} nurse:`, error);
        this.form.error = error;
        this.toastr.error(`Error ${isNew ? 'creando' : 'actualizando'} el especialista`);
      }
    });
  }
}
