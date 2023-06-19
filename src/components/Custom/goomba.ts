const goombaPosition0: [number, number, number] = [-40, 2.5, 4];
const goombaPosition1: [number, number, number] = [-19, 2.5, 4];
const goombaPosition3: [number, number, number] = [25, 10.2, 4];
const goombaPosition4: [number, number, number] = [25, 2.5, 4];

const GOOMBA = {
  goomba_0: {
    position: goombaPosition0,
    right_limit: -37.6,
    left_limit: -63.660186767578125,
    start_to_move_when_main_is_at: null,
  },
  goomba_1: {
    position: goombaPosition1,
    right_limit: -19.4,
    left_limit: -24.8,
    start_to_move_when_main_is_at: null,
  },
  goomba_2: {
    position: goombaPosition1,
    right_limit: -7.9,
    left_limit: -16,
    start_to_move_when_main_is_at: null,
  },
  goomba_3: {
    position: goombaPosition3,
    // right_limit: 23.26,
    // left_limit: 9.6,
    start_to_move_when_main_is_at: -6,
  },
  goomba_4: {
    position: goombaPosition4,
    right_limit: 23.26,
    left_limit: 9.6,
    start_to_move_when_main_is_at: -6,
  },
};

export default GOOMBA;

export type TGoomba = "goomba_0" | "goomba_1" | "goomba_2";
export const goombaArray = Object.keys(GOOMBA) as TGoomba[];
