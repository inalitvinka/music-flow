import { Directive, ElementRef, inject, output } from '@angular/core';
import { FastAverageColor } from 'fast-average-color';

@Directive({
  selector: '[playerAverageColor]',
  host: {
    '(load)': 'onLoad()',
  },
})
export class AverageColor {
  private imageElement = inject<ElementRef<HTMLImageElement>>(ElementRef);
  color = output<string>();

  onLoad() {
    const fac = new FastAverageColor();
    const color = fac.getColor(this.imageElement.nativeElement);
    this.color.emit(color.hex);
  }
}
