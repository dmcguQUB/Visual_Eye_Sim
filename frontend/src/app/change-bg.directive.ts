//class to change background colour of question if wrong or right

import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeBg]'
})
export class ChangeBgDirective {

  //input if the question is correct
  @Input() isCorrect: Boolean=false;
  constructor(private el: ElementRef,private render: Renderer2) { }
  //add a host listener which will call answer method when a click event occurs
  @HostListener('click') answer(){
    //if user answers correct
    if(this.isCorrect){
      //render the native element and turn the background green
      this.render.setStyle(this.el.nativeElement,'background','green');
      this.render.setStyle(this.el.nativeElement,'color','white');//change color to white
      this.render.setStyle(this.el.nativeElement,'border','2px solid grey');

    }else{
      this.render.setStyle(this.el.nativeElement,'background','red');
      this.render.setStyle(this.el.nativeElement,'color','white');//change color to white
      this.render.setStyle(this.el.nativeElement,'border','2px solid grey');

    }
  }

}
