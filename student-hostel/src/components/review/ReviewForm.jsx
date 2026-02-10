import { useState } from 'react';
import { Star, X, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../../redux/slices/Thunks/reviewThunks';

const ReviewForm = ({ accommodationId, bookingId, existingReview = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        accommodation_id: accommodationId,
        booking_id: bookingId,
        rating,
        comment: comment.trim(),
      };

      if (existingReview) {
        await dispatch(updateReview({ 
          id: existingReview.id, 
          data: reviewData 
        })).unwrap();
      } else {
        await dispatch(createReview(reviewData)).unwrap();
      }

      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || err.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  };

  const closeButtonStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
  };

  const errorBannerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const ratingSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  };

  const labelHintStyle = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#94a3b8',
  };

  const starsContainerStyle = {
    display: 'flex',
    gap: '8px',
  };

  const starButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
  };

  const ratingLabelStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#f59e0b',
    margin: 0,
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const textareaStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#334155',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const characterCountStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'right',
  };

  const guidelinesStyle = {
    padding: '16px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  };

  const guidelinesTitleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e40af',
    margin: '0 0 12px 0',
  };

  const guidelinesListStyle = {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#1e40af',
    lineHeight: '1.8',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const cancelButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const submitButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: loading || rating === 0 ? 0.6 : 1,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </h2>
        {onCancel && (
          <button style={closeButtonStyle} onClick={onCancel}>
            <X size={20} />
          </button>
        )}
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Star Rating */}
        <div style={ratingSectionStyle}>
          <label style={labelStyle}>Your Rating</label>
          <div style={starsContainerStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={starButtonStyle}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={40}
                  color={star <= (hoveredRating || rating) ? '#f59e0b' : '#e5e7eb'}
                  fill={star <= (hoveredRating || rating) ? '#f59e0b' : 'none'}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={ratingLabelStyle}>{ratingLabels[rating]}</p>
          )}
        </div>

        {/* Comment Textarea */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Your Review
            <span style={labelHintStyle}> (minimum 10 characters)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this accommodation. What did you like? What could be improved?"
            style={textareaStyle}
            rows={6}
            maxLength={1000}
            required
          />
          <div style={characterCountStyle}>
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Guidelines */}
        <div style={guidelinesStyle}>
          <h4 style={guidelinesTitleStyle}>Review Guidelines</h4>
          <ul style={guidelinesListStyle}>
            <li>Be honest and constructive</li>
            <li>Focus on your personal experience</li>
            <li>Don't include personal information</li>
            <li>Avoid offensive language</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={actionsStyle}>
          {onCancel && (
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading || rating === 0}
          >
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

