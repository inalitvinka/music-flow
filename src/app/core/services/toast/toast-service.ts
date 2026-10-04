import { Service, inject } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core';

@Service()
export class ToastService {
  private toastService = inject(TuiNotificationService);

  success(message: string) {
    this.toastService
      .open(message, {
        appearance: 'positive',
      })
      .subscribe();
  }

  error(message: string) {
    this.toastService
      .open(message, {
        appearance: 'negative',
      })
      .subscribe();
  }

  info(message: string) {
    this.toastService
      .open(message, {
        appearance: 'info',
      })
      .subscribe();
  }

  warning(message: string) {
    this.toastService
      .open(message, {
        appearance: 'warning',
      })
      .subscribe();
  }
}
