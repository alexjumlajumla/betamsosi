import React from 'react';
import cls from './header.module.scss';
import { MicFillIcon } from 'components/icons';

interface HeaderProps {
  onMicClick?: () => void;
}

export default function Header({ onMicClick = () => {} }: HeaderProps) {
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