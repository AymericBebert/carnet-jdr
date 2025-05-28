import {Component, input} from '@angular/core';

@Component({
  selector: 'app-icon-ritual',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 341 341" xmlns="http://www.w3.org/2000/svg">
      <path id="star" fill="none" stroke="currentColor" opacity="0.2" style="stroke-width:13;stroke-linejoin:bevel"
            d="M 25,219 L 317,219 L 81,45 L 171,324 L 261,45 z"
      />
      <circle id="circle" fill="none" stroke="currentColor" opacity="0.2" style="stroke-width:13"
              cx="171" cy="171" r="163"
      />
    </svg>
    <span style="position: absolute" [style.line-height.px]="size()" [style.font-size.px]="size()">R</span>
  `,
  host: {
    style: 'display: inline-flex; position: relative; justify-content: center',
  }
})
export class IconRitualComponent {
  public readonly size = input(24);
}
