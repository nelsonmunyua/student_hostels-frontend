import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ArrowLeft } from 'lucide-react';
import { fetchReviewsByAccommodation } from '../../../../redux/slices/Thunks/reviewThunks';
import { ReviewList, ReviewForm } from '../../../review';

const AccommodationReviews = () => {
  const { hostelId } = useParams();
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const [showForm, setShowForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (hostelId) {
      dispatch(fetchReviewsByAccommodation({ 
        accommodationId: parseInt(hostelId) 
      }));
    }
  }, [dispatch, hostelId]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      setAverageRating(total / reviews.length);
      setTotalReviews(reviews.length);
    }
  }, [reviews]);

  const handleReviewSuccess = () => {
    setShowForm(false);
    dispatch(fetchReviewsByAccommodation({ 
      accommodationId: parseInt(hostelId) 
    }));
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 20px',
  };

  const maxWidthContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    color: '#64748b',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginTop: '4px',
  };

  const ratingOverviewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
  };

  const bigRatingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 24px',
    borderRight: '1px solid #e5e7eb',
  };

  const ratingNumberStyle = {
    fontSize: '48px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: 1,
  };

  const starsRowStyle = {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
  };

  const totalReviewsTextStyle = {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  };

  const ratingBreakdownStyle = {
    flex: 1,
    paddingLeft: '24px',
  };

  const breakdownRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  };

  const breakdownLabelStyle = {
    width: '60px',
    fontSize: '14px',
    color: '#64748b',
  };

  const breakdownBarStyle = {
    flex: 1,
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const breakdownFillStyle = {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: '4px',
  };

  const breakdownCountStyle = {
    width: '30px',
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'right',
  };

  const writeReviewButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    textAlign: 'center',
  };

  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (reviews) {
    reviews.forEach((review) => {
      const rating = Math.floor(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
      }
    });
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <a href={`/student/accommodations/${hostelId}`} style={backButtonStyle}>
            <ArrowLeft size={20} />
          </a>
          <div>
            <h1 style={titleStyle}>Reviews</h1>
            <p style={subtitleStyle}>See what others say about this accommodation</p>
          </div>
        </div>

        {/* Rating Overview */}
        <div style={ratingOverviewStyle}>
          <div style={bigRatingStyle}>
            <div style={ratingNumberStyle}>{averageRating.toFixed(1)}</div>
            <div style={starsRowStyle}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  color={star <= Math.round(averageRating) ? '#f59e0b' : '#e5e7eb'}
                  fill={star <= Math.round(averageRating) ? '#f59e0b' : 'none'}
                />
              ))}
            </div>
            <p style={totalReviewsTextStyle}>{totalReviews} reviews</p>
          </div>

          <div style={ratingBreakdownStyle}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} style={breakdownRowStyle}>
                  <span style={breakdownLabelStyle}>{rating} ★</span>
                  <div style={breakdownBarStyle}>
                    <div
                      style={{
                        ...breakdownFillStyle,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                  <span style={breakdownCountStyle}>{count}</span>
                </div>
              );
            })}
          </div>

          <button 
            style={writeReviewButtonStyle}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* Content */}
        <div style={contentStyle}>
          {showForm ? (
            <ReviewForm
              accommodationId={parseInt(hostelId)}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <ReviewList
              reviews={reviews}
              loading={loading}
              averageRating={averageRating}
              totalReviews={totalReviews}
              showFilters={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationReviews;

