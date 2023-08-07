import {
  Component,
  OnInit,
} from '@angular/core';
import { VisualFieldsComponent } from '../visual-fields/visual-fields.component';

@Component({
  selector: 'app-visual-fields-test-right',
  templateUrl: './visual-fields-test-right.component.html',
  styleUrls: ['./visual-fields-test-right.component.css'],
})
export class VisualFieldsTestRightComponent
  extends VisualFieldsComponent
  implements OnInit
{
  setHandImageSrc(): string {
    return 'assets/Right-hand.png';
  }

  setButtonMessages(): { [id: string]: string } {
    return {
      topLeftButton: "Your hand's movement is visible, but it's somewhat fuzzy.",
      topRightButton: "I notice your hand moving, but it's kind of blurry.",
      bottomLeftButton: "Your hand is moving, but it looks pretty fuzzy.",
      bottomRightButton: "I can see your hand moving, but it's a bit blurry."
    };
  }

  //change position of the hand
  override drawHand() {
    this.ctx.drawImage(this.handImage, 270, 30); //<----need to change this for each
  }

    //image to determine which eye it is for the button
    override thisEye: string = 'Right';
    override otherEye: string = 'Left ';


  override ngOnInit() {
    super.ngOnInit();
    
    
  }
}