import { assetFactory } from './assetFactory';

export default function generateConfettiObject(key: string) {
  return {
    key,
    type: 'svg',
    src: assetFactory(key),
    weight: 0.05,
    size: 40,
  };
}
