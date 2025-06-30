import React from 'react';
import cls from './mobileHeader.module.scss';
import { MicFillIcon } from 'components/icons';

interface MobileHeaderProps {
  isShopDetailPage: boolean;
  onMicClick?: () => void;
}

export default function MobileHeader({ isShopDetailPage, onMicClick = () => {} }: MobileHeaderProps) {
  return (
    <header className={cls.header}>
      <div className={cls.actions}>
        <button
          className={cls.micButton}
          onClick={onMicClick}
          aria-label="Voice Order"
          style={{ marginLeft: 16 }}
        >
          <MicFillIcon size={24} />
        </button>
      </div>
    </header>
  );
} 