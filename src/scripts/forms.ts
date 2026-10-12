// On-page validation for forms marked [data-validate].
// [data-validate="submit"] forms post to the server once valid (account and admin forms).
// Other forms confirm on the page only; nothing is sent until a form provider is connected.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function errorFor(control: Control): string | null {
  const value = control.value.trim();
  if (control.required && !value) {
    return control.dataset.requiredMessage ?? 'Please fill in this field.';
  }
  if (control.type === 'email' && value && !EMAIL_PATTERN.test(value)) {
    return 'Please enter an email address like name@example.com.';
  }
  if ('minLength' in control && control.minLength > 0 && value && value.length < control.minLength) {
    return control.dataset.minlengthMessage ?? `Please use at least ${control.minLength} characters.`;
  }
  return null;
}

function showError(control: Control, message: string | null): void {
  const errorEl = document.getElementById(`${control.id}-error`);
  if (!errorEl) return;
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    control.setAttribute('aria-invalid', 'true');
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
    control.removeAttribute('aria-invalid');
  }
}

function initForm(form: HTMLFormElement): void {
  const controls = Array.from(form.querySelectorAll<Control>('input, textarea, select')).filter((c) => c.id);
  const success = form.parentElement?.querySelector<HTMLElement>('[data-form-success]');

  for (const control of controls) {
    // Re-check a field once it has been flagged, so the message clears as the visitor fixes it.
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') showError(control, errorFor(control));
    });
    control.addEventListener('blur', () => {
      if (control.getAttribute('aria-invalid') === 'true') showError(control, errorFor(control));
    });
  }

  form.addEventListener('submit', (event) => {
    let firstInvalid: Control | null = null;
    for (const control of controls) {
      const message = errorFor(control);
      showError(control, message);
      if (message && !firstInvalid) firstInvalid = control;
    }
    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
      return;
    }
    if (form.dataset.validate === 'submit') return;
    event.preventDefault();
    form.reset();
    if (success) {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-validate]').forEach(initForm);
