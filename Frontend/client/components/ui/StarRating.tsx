"use client";

import { useState } from "react";

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    isInteractive?: boolean;
}

export default function StarRating({ rating, setRating, isInteractive = false }: StarRatingProps) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => setRating && setRating(star)}
                    onMouseEnter={() => isInteractive && setHover(star)}
                    onMouseLeave={() => isInteractive && setHover(0)}
                    className={`${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-6 h-6 transition-colors ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                </button>
            ))}
        </div>
    );
}