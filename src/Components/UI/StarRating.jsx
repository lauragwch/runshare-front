import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 'medium',
  showHoverEffect = true 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating) => {
    if (!readonly && showHoverEffect) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const getStarClass = (index) => {
    const rating = hoverValue || value || 0;
    return index <= rating ? 'star-filled' : 'star-empty';
  };

  return (
    <div 
      className={`star-rating ${size} ${readonly ? 'readonly' : 'interactive'}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          className={`star-button ${getStarClass(index)}`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          disabled={readonly}
          aria-label={`${index} étoile${index > 1 ? 's' : ''}`}
        >
          <i className="fa-solid fa-star"></i>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
