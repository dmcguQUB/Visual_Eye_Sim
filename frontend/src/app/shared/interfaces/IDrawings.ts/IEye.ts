//used to create the eyes on canvas
export interface Eye {
  eyeball: EyeBallOrPupil;
  pupil: EyeBallOrPupil;
}

export interface EyeBallOrPupil {
  x: number;
  y: number;
  radius: number;
}

export interface Iris { // <-- Defined type
  iris: {
    x: number;
    y: number;
    radius: number;
  };
  pupil: {
    x: number;
    y: number;
    radius: number;
    targetRadius: number;
  };

}