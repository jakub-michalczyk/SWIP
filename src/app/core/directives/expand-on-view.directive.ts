import { AfterViewInit, Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appExpandOnView]',
})
export class ExpandOnViewDirective implements AfterViewInit {
  @HostBinding('class.h-0') isHidden = true;
  @HostBinding('class.overflow-hidden') overflowHidden = true;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isHidden = false;
          this.renderer.removeClass(this.el.nativeElement, 'h-0');
          this.renderer.removeClass(this.el.nativeElement, 'scale-y-0');
          this.renderer.addClass(this.el.nativeElement, 'h-64');
          this.renderer.addClass(this.el.nativeElement, 'scale-y-100');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(this.el.nativeElement);
  }
}
