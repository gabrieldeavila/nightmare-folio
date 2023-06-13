const goombaPosition0: [number, number, number] = [-40, 2.5, 4];
const goombaPosition1: [number, number, number] = [-19, 2.5, 4];

const GOOMBA = {
  goomba_0: {
    position: goombaPosition0,
    right_limit: -37.6,
    left_limit: -63.660186767578125,
  },
  goomba_1: {
    position: goombaPosition1,
    right_limit: -19.4,
    left_limit: -24.8,
  },
  goomba_2: {
    position: goombaPosition1,
    right_limit: -7.9,
    left_limit: -16,
  },
};

export default GOOMBA;

export type TGoomba = "goomba_0" | "goomba_1" | "goomba_2";
export const goombaArray = Object.keys(GOOMBA) as TGoomba[];
