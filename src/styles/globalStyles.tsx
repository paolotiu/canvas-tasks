import tw, { globalStyles } from 'twin.macro';
import { globalCss } from '../../stitches.config';

const customStyles = {
  body: {
    ...tw`antialiased`,
  },
  input: tw`focus:outline-none`,
};

const styles = () => {
  globalCss(customStyles)();
  globalCss(globalStyles as Record<any, any>)();
};

export default styles;
