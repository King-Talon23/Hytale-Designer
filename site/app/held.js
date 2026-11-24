// What each move holds, and in which hand (the game's attachment bones): [item (game.js PROPS), bone, shift, turn].
// shift: [x, y, z] in model units in the scene (the figure faces +z), whatever the hand's turn.
// turn: [x, y, z] degrees on the item inside the hand.
// Checked against the game 2026-11-23 (an actor in the player's skin holding the real item, front and side), and
// measured by dev/tests/held.test.js (the hand on the grip in every pose).
export const HELD = {
  // as in game: the hands on the glider's grips (measured 62 above them unshifted)
  Glide: { '*': [['glider', 'R-Attachment', [0, -62, 0]]] },
  Poses: {
    BattleAxe: [['battleaxe', 'R-Attachment']],
    Book_Read: [['book', 'L-Attachment']],
    Show_Block: [['block', 'R-Attachment']],
    Show_Item: [['potion', 'R-Attachment']],
    Pickaxe: [['pickaxe', 'R-Attachment']],
    // the pose moves the staff's Handle as if the staff were turned round its shaft: in game the crystal rests on the
    // ground in front of the right foot and the shaft rises through the hand to behind the shoulder
    Staff: [['wizstaff', 'R-Attachment', null, [0, 180, 0]]],
    Sword: [['sword', 'R-Attachment']],
    Warhammer: [['mace', 'R-Attachment']],
  },
  Taunt: {
    Staff_Helicopter: [['staff', 'R-Attachment']],
    Sword_Back: [['sword', 'R-Attachment']],
    Sword_Front: [['sword', 'R-Attachment']],
  },
};
export const heldBy = (g, n) => HELD[g]?.[n] || HELD[g]?.['*'] || [];
