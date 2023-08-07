import { Component, OnInit } from '@angular/core';
import { VisualFieldsComponent } from '../visual-fields/visual-fields.component';

@Component({
  selector: 'app-visual-fields-test-left',
  templateUrl: './visual-fields-test-left.component.html',
  styleUrls: ['./visual-fields-test-left.component.css'],
})
export class VisualFieldsTestLeftComponent
  extends VisualFieldsComponent
  implements OnInit
{
  setHandImageSrc(): string {
    return 'assets/Left-hand.png';
  }
  setButtonMessages(): { [id: string]: string } {
    return {
      topLeftButton: 'Yea I can see your hand',
      topRightButton: 'Very clear I can see',
      bottomLeftButton: 'Your hand is visible',
      bottomRightButton: 'Yes I notice your hand',
    };
  }

  //change position of the hand
  override drawHand() {
    this.ctx.drawImage(this.handImage, 80, 30); //<----need to change this for each
  }

    //image to determine which eye it is
    override thisEye: string = 'Left';
    override otherEye: string = 'Right ';


  override ngOnInit() {
    super.ngOnInit();
    
  }
}
