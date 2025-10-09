import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  sending = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    website: [''],
    ts: [Date.now()],
  });

  get f() {
    return this.form.controls;
  }

  async submit() {
    if (this.form.value.website) return;
    const elapsed = Date.now() - (this.form.value.ts ?? 0);
    if (elapsed < 3000 || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.error.set(null);
    try {
      const res = await fetch('https://formspree.io/f/xpwyaqan', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.form.value.name,
          email: this.form.value.email,
          subject: this.form.value.subject,
          message: this.form.value.message,
        }),
      });

      if (!res.ok) throw new Error('bad');
      const data = await res.json().catch(() => ({}));
      if (data?.ok === true || res.status === 200) {
        this.sent.set(true);
        this.form.reset({ website: '', ts: Date.now() });
      } else throw new Error('bad');
    } catch {
      this.error.set('Could not send. Please try again later.');
    } finally {
      this.sending.set(false);
    }
  }
}
