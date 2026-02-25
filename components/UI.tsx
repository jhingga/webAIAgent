"use client";

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  className = '',
  children,
}) => {
  return (
    <div
      className={`
        bg-slate-900 border border-slate-700 rounded-lg
        hover:border-slate-600 transition-colors
        ${className}
      `}
    >
      {(title || description) && (
        <div className="px-5 py-4 border-b border-slate-700">
          {title && <h3 className="font-semibold text-slate-100">{title}</h3>}
          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
}

const badgeVariants = {
  primary: 'bg-blue-500/20 text-blue-300',
  success: 'bg-green-500/20 text-green-300',
  warning: 'bg-yellow-500/20 text-yellow-300',
  error: 'bg-red-500/20 text-red-300',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  className = '',
  children,
}) => {
  return (
    <span
      className={`
        inline-block px-2 py-1 text-xs font-semibold rounded
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin
        ${sizeMap[size]}
        ${className}
      `}
    />
  );
};

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

const alertStyles = {
  info: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  success: 'bg-green-500/10 text-green-300 border-green-500/30',
  warning: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  error: 'bg-red-500/10 text-red-300 border-red-500/30',
};

const alertIcons = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  error: '✕',
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
}) => {
  return (
    <div
      className={`
        rounded-lg border px-4 py-3 flex gap-3
        ${alertStyles[type]}
      `}
    >
      <span className="text-lg flex-shrink-0">{alertIcons[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-70 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
};
