import React from 'react';
import cls from './footer.module.scss';
import { MicFillIcon } from 'components/icons';

export default function Footer({ onOpenVoiceOrder }: { onOpenVoiceOrder?: () => void }) {
  return (
    <footer className={cls.footer}>
      <button
        className={cls.iconBtn}
        onClick={onOpenVoiceOrder}
        aria-label="Voice Order"
        style={{ marginLeft: 8 }}
      >
        <MicFillIcon size={24} />
      </button>
    </footer>
  );
} 