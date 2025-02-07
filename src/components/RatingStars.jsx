import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ averageRating }: { averageRating: number }) => {
  return (
    <div className="flex items-center mt-1">
      {[...Array(5)].map((_, index) => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating - fullStars >= 0.5 && index === fullStars;

        return (
          <span key={index} className="relative w-6 h-6">
            {/* Background Star (Grey) */}
            <FaRegStar color="#d7d7d7" size="24px" className="absolute top-0 left-0" />

            {/* Foreground Star (Gold) */}
            {index < fullStars ? (
              <FaStar color="#ffd700" size="24px" className="absolute top-0 left-0" />
            ) : hasHalfStar ? (
              <FaStarHalfAlt color="#ffd700" size="24px" className="absolute top-0 left-0" />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
