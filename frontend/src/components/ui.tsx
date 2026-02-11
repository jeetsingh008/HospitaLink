import clsx from "clsx";
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div className={clsx("bg-white rounded-lg shadow-sm border border-gray-100 p-6", className)}>
            {children}
        </div>
    );
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = ({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-emerald-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={clsx(
                "inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className, id, ...props }: InputProps) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={clsx(
                    "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm",
                    error ? "border-red-300 ring-red-500" : "border-gray-300"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
