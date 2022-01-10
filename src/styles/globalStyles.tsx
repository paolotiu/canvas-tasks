import tw, { globalStyles } from 'twin.macro';
import { globalCss } from '../../stitches.config';

const customStyles = {
  html: {
    ...tw`w-full h-full`,
  },
  body: {
    ...tw`w-full h-full antialiased`,
  },
  input: tw`focus:outline-none`,
};

const styles = () => {
  globalCss(customStyles)();
  globalCss(globalStyles as Record<any, any>)();
};

export default styles;
