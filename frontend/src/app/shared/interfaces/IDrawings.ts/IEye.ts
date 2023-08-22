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
