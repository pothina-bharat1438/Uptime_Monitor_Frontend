import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-endpoint-form',
  templateUrl: './endpoint-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EndpointFormComponent {
  httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'HEAD', value: 'HEAD' }
  ];
  form: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required]],
      method: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.addEndpoint(this.form.value).subscribe(() => {
      this.form.reset();
      this.api.refreshEndpoints(); // notify dashboard
    });
  }

  reset() {
    this.form.reset();
  }
}
