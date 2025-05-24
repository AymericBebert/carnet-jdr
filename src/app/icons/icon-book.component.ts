import {Component, input} from '@angular/core';

/* eslint-disable max-len */
@Component({
  selector: 'app-icon-book',
  template: `
    <!-- eslint-disable max-len -->
    <svg id="book" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 256 256"
         xmlns="http://www.w3.org/2000/svg">
      <path id="page1" fill="none" stroke="currentColor"
            style="stroke-width:6;stroke-linecap:round;stroke-linejoin:round"
            d="M 138,209 H 200"
      />
      <path id="bottomEnd" fill="none" stroke="currentColor"
            style="stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
            d="m 209,189 0,40 c 0,0 -6,-8 -6,-21 0,-11 6,-19 6,-19 z"
      />
      <path id="star" fill="none" stroke="currentColor"
            style="stroke-width:9;stroke-linecap:butt;stroke-linejoin:round"
            d="M 163,124 L 139,110 L 113,124 L 117,95 L 97,74 L 126,70 L 139,45 L 151,70 L 180,74 L 160,95 Z"
      />
      <path id="line1" fill="none" stroke="currentColor"
            style="stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
            d="M 94,146 H 183"
      />
      <path id="line2" fill="none" stroke="currentColor"
            style="stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
            d="M 94,164 H 183"
      />
      <path id="bookmark" fill="none" stroke="currentColor"
            style="stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
            d="M 70,208 H 116 V 245 L 93,235 70,245 Z"
      />
      <path id="book" fill="none" stroke="currentColor"
            style="stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
            d="m 38,209 c 0,-16 16,-20 26,-20 l 145,0 0,42 -92,0 m -48,0 -10,0 C 49,230 38,222 38,209 L 38,45 c 0,-15 10,-22 27,-22 H 217 V 189 L 65,189 V 25"
      />
    </svg>
  `,
  host: {
    style: 'display: block; line-height: 0',
  }
})
export class IconBookComponent {
  public readonly size = input(24);
}
