import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /**
   * The public header is sticky (77px on mobile, 87px on desktop), so anchored
   * sections have to stop below it. The router's anchor scrolling positions by
   * element offset and ignores CSS `scroll-margin-top`, so the offset is
   * registered on the ViewportScroller instead.
   */
  constructor() {
    inject(ViewportScroller, { optional: true })?.setOffset([0, 96]);
  }
}
