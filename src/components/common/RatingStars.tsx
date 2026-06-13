import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars: React.FC<{ rating: number; reviews?: number }> = ({ rating, reviews }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                />
            ))}
            {reviews !== undefined && <span className="text-xs text-gray-400 ml-1">({reviews})</span>}
        </div>
    );
};