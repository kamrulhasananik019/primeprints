import { Phone } from 'lucide-react';
import { phoneNumber, phoneNumberTel } from '@/lib/site';

type CallNowButtonProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'footer' | 'contact';
  className?: string;
};

export default function CallNowButton({
  size = 'medium',
  variant = 'default',
  className = '',
}: CallNowButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 sm:gap-3 font-bold transition-all duration-300 rounded-xl active:scale-95';

  const sizeStyles = {
    small: 'px-3 sm:px-4 py-2 text-xs sm:text-sm',
    medium: 'px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base',
    large: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
  };

  const variantStyles = {
    default:
      'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105 border border-amber-700',
    footer:
      'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg hover:scale-105 border border-amber-700 w-full justify-center',
    contact:
      'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105 border border-amber-700 w-full justify-center sm:w-auto',
  };

  return (
    <a
      href={`tel:${phoneNumberTel}`}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      aria-label={`Call ${phoneNumber}`}
    >
      <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">Call Now</span>
      <span className="sm:hidden">Call</span>
    </a>
  );
}
