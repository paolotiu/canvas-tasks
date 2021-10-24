import random from 'just-random';
import generateConfettiObject from './generateConfettiObject';

const confettiFlavors = [
  'balloon',
  'bifrost_trophy',
  'butterfly',
  'einstein_rosen_trophy',
  'fire',
  'flowers',
  'four_leaf_clover',
  'gift',
  'gnome',
  'helix_rocket',
  'horse_shoe',
  'hot_air_balloon',
  'magic_mystery_thumbs_up',
  'medal',
  'moon',
  'ninja',
  'panama_rocket',
  'panda',
  'panda_unicycle',
  'pinwheel',
  'pizza_slice',
  'rocket',
  'star',
  'thumbs_up',
  'trophy',
];

/**
 * Returns a random element to be added to the confetti. New assets
 * should be added to the celebrations directory, then added to the list of
 * potential flavors.
 */
export default function getRandomConfettiFlavor() {
  try {
    return generateConfettiObject(random(confettiFlavors) || '');
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    return null;
  }
}
