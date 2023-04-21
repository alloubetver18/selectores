import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
    /* pais: [{ value: '', disabled: true }, Validators.required],
    frontera: [{ value: '', disabled: true }, Validators.required], */
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  /*   fronteras: string[] = []; */
  fronteras: PaisSmall[] = [];

  //cargador
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    /* this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
      this.paisesService.getPaisesPorRegion(region).subscribe((paises) => {
        this.paises = paises;
        this.miFormulario.get('pais')?.setValue('');
        console.log(this.paises);
      });
    }); */
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          /*           this.miFormulario.get('frontera')?.disable(); */
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset('');
          this.fronteras = [];
          this.cargando = true;
          /*           this.miFormulario.get('frontera')?.enable(); */
        }),
        switchMap((alpha) => this.paisesService.getPaisPorCodigo(alpha)),
        switchMap((pais) =>
          this.paisesService.getPaisesPorCodigos(pais?.borders!)
        )
      )
      .subscribe((paises) => {
        /* this.fronteras = pais?.borders || []; */
        /*         console.log(paises); */
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
