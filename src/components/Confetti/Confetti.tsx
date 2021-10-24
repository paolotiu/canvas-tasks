import React, { useEffect, useState } from 'react';
import ConfettiGenerator from 'confetti-js';
import { assetFactory } from './assetFactory';
import getRandomConfettiFlavor from './confettiFlavor';

interface Props {}

const Confetti = (props: Props) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!visible) {
      return;
    }
    let forcefulCleanup: any;
    let clearConfettiOnSpaceOrEscape: any;
    let confetti: any;
    const cleanup = () => {
      confetti.clear();
      document.body.removeEventListener('keydown', clearConfettiOnSpaceOrEscape);
      if (forcefulCleanup) {
        forcefulCleanup = clearTimeout(forcefulCleanup);
      }
      setVisible(false);
    };
    const conf = async () => {
      const flavor = getRandomConfettiFlavor();
      confetti = new ConfettiGenerator({
        target: 'confetti-canvas',
        max: 160,
        clock: 50,
        respawn: false,
        props: ['square', flavor].filter((p) => p !== null),
      });

      clearConfettiOnSpaceOrEscape = (e: KeyboardEvent) => {
        if (e.code === 'Enter' || e.code === 'Escape') {
          e.preventDefault();
          cleanup();
        }
      };
      document.body.addEventListener('keydown', clearConfettiOnSpaceOrEscape);
      confetti.render();
      // setTimeout(() => {
      //   showFlashAlert({
      //     message: I18n.t('Great work! From the Canvas developers'),
      //     srOnly: true
      //   })
      // }, 2500)

      // Automatically clear animation after 3 seconds, avoiding 5 second window
      // defined by WCAG Success Criterion 2.2.2: Pause, Stop, Hide.
      forcefulCleanup = setTimeout(cleanup, 3000);
    };

    conf();

    return cleanup;
  }, [visible]);

  return !visible ? null : (
    <canvas
      id="confetti-canvas"
      data-testid="confetti-canvas"
      style={{ position: 'fixed', top: 0, left: 0 }}
    />
  );
};

export default Confetti;
