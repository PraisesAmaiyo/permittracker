import React from 'react';

const Button = ({
  children,
  onClick,
  loading = false,
  variant = 'primary',
  fullWidth = true, // Default to true since you use wide buttons often
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseStyles =
    'py-3 px-6 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0';

  //   const baseStyles =
  //     'w-full md:w-auto px-6 py-3  rounded-xl text-sm font-bold hover:shadow-lg  transition-all flex items-center justify-center gap-2 shrink-0  cursor-pointer ';

  const variants = {
    primary:
      'bg-primary text-white shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.98]',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
