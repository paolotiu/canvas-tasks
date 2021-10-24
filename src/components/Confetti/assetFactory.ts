export const assetFactory = (key: string) => {
  switch (key) {
    case 'balloon':
      return '/confettiVariant/Balloon.svg';
    case 'bifrost_trophy':
      return '/confettiVariant/BifrostTrophy.svg';
    case 'butterfly':
      return '/confettiVariant/Butterfly.svg';
    case 'einstein_rosen_trophy':
      return '/confettiVariant/EinsteinRosenTrophy.svg';
    case 'fire':
      return '/confettiVariant/Fire.svg';
    case 'flowers':
      return '/confettiVariant/Flowers.svg';
    case 'four_leaf_clover':
      return '/confettiVariant/FourLeafClover.svg';
    case 'gift':
      return '/confettiVariant/Gift.svg';
    case 'gnome':
      return '/confettiVariant/Gnome.svg';
    case 'helix_rocket':
      return '/confettiVariant/HelixRocket.svg';
    case 'horse_shoe':
      return '/confettiVariant/HorseShoe.svg';
    case 'hot_air_balloon':
      return '/confettiVariant/HotAirBalloon.svg';
    case 'magic_mystery_thumbs_up':
      return '/confettiVariant/MagicMysteryThumbsUp.svg';
    case 'medal':
      return '/confettiVariant/Medal.svg';
    case 'moon':
      return '/confettiVariant/Moon.svg';
    case 'ninja':
      return '/confettiVariant/Ninja.svg';
    case 'panama_rocket':
      return '/confettiVariant/PanamaRocket.svg';
    case 'panda':
      return '/confettiVariant/Panda.svg';
    case 'panda_unicycle':
      return '/confettiVariant/PandaUnicycle.svg';
    case 'pinwheel':
      return '/confettiVariant/Pinwheel.svg';
    case 'pizza_slice':
      return '/confettiVariant/PizzaSlice.svg';
    case 'rocket':
      return '/confettiVariant/Rocket.svg';
    case 'star':
      return '/confettiVariant/Star.svg';
    case 'thumbs_up':
      return '/confettiVariant/ThumbsUp.svg';
    case 'trophy':
      return '/confettiVariant/Trophy.svg';
    default:
      throw new Error(`Unknown asset key: ${key}`);
  }
};
