import { Modal } from "src/app/_models/modal";

export type Units = "kg" | "días" | "ha" | "años";
export type CatalogMode = "view" | "select" | "multiselect" | "readonly";
export type View = 'page' | 'modal' | 'inline';
export type DetailActions = 'edit' | 'cancel' | 'delete' | 'create';

export const confirmActionModal: Modal = {
  title: "Confirmar",
  message: "¿Está seguro de que desea guardar los cambios?",
  btnOkText: "Guardar",
  btnCancelText: "Cancelar",
  result: false,
};
