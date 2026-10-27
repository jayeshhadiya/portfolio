import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import profileData from '@data/profile.data';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
  @if(status() === 'sent'){
    <div class="rounded-lg border border-primary-500 bg-primary-50 dark:bg-gray-800 p-5" role="status">
      <p class="font-semibold dark:text-white">Thanks, your message was sent!</p>
      <p class="mt-1 text-sm">I'll get back to you at the email you gave.</p>
      <button type="button" class="mt-3 text-sm underline" (click)="status.set('idle')">Send another message</button>
    </div>
  } @else {
  <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4" novalidate>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label class="flex flex-col gap-1 text-sm font-medium dark:text-white">
        Name
        <input formControlName="name" type="text" autocomplete="name" [class]="inputClass" />
        @if(showError('name')){ <span class="text-xs text-red-600 dark:text-red-400">Please enter your name.</span> }
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium dark:text-white">
        Email
        <input formControlName="email" type="email" autocomplete="email" [class]="inputClass" />
        @if(showError('email')){ <span class="text-xs text-red-600 dark:text-red-400">Please enter a valid email.</span> }
      </label>
    </div>
    <label class="flex flex-col gap-1 text-sm font-medium dark:text-white">
      Subject
      <input formControlName="subject" type="text" [class]="inputClass" />
    </label>
    <label class="flex flex-col gap-1 text-sm font-medium dark:text-white">
      Message
      <textarea formControlName="message" rows="5" [class]="inputClass"></textarea>
      @if(showError('message')){ <span class="text-xs text-red-600 dark:text-red-400">Please write a message (at least 10 characters).</span> }
    </label>
    <!-- Honeypot: hidden from people, bots tend to fill it in. -->
    <input formControlName="botcheck" type="checkbox" class="hidden" tabindex="-1" autocomplete="off" />
    @if(status() === 'error'){
      <p class="text-sm text-red-600 dark:text-red-400" role="alert">
        Something went wrong. Please try again, or email me at
        <a class="underline" [href]="'mailto:' + email">{{ email }}</a>.
      </p>
    }
    <div>
      <button type="submit" [disabled]="status() === 'sending'"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-60 px-5 py-2.5 text-sm font-medium text-white transition-colors">
        {{ status() === 'sending' ? 'Sending…' : 'Send message' }}
      </button>
    </div>
  </form>
  }
  `
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  email = profileData.email;
  status = signal<FormStatus>('idle');
  inputClass = 'rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 font-normal text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    botcheck: [false],
  });

  showError(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, subject, message, botcheck } = this.form.getRawValue();
    const finalSubject = subject || `New message from ${name} via portfolio`;

    // No Web3Forms key yet: open the visitor's email app with everything filled in.
    if (!environment.web3formsKey) {
      const body = `${message}\n\n${name}\n${email}`;
      this.document.location.href = `mailto:${this.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    this.status.set('sending');
    this.http.post<{ success: boolean }>('https://api.web3forms.com/submit', {
      access_key: environment.web3formsKey,
      name,
      email,
      subject: finalSubject,
      message,
      from_name: 'Portfolio contact form',
      botcheck,
    }).subscribe({
      next: res => {
        if (res.success) {
          this.form.reset();
          this.status.set('sent');
        } else {
          this.status.set('error');
        }
      },
      error: () => this.status.set('error'),
    });
  }
}
