import { Component } from "@angular/core";
import { patients } from "../../../data/patients";

@Component({
  selector: "patients",
  templateUrl: "./patients.component.html",
})
export class PatientsComponent {
  patients = patients;
}