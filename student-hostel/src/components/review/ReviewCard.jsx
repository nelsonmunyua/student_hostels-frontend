import { Star, ThumbsUp, Flag, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import reviewApi from '../../api/Reviewapi.api';

const ReviewCard = ({ review, onLike, onReport, onDelete, canDelete = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(review.isLiked || false);
  const [likeCount, setLikeCount] = useState(review.helpful_count || review.helpfulCount || 0);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await reviewApi.unlikeReview(review.id);
      } else {
        await reviewApi.likeReview(review.id);
      }
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      if (onLike) onLike(review.id);
    } catch (error) {
      console.error('Error liking review:', error);
      // Toggle local state anyway for better UX
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  };

  const handleReport = () => {
    if (window.confirm('Report this review as inappropriate?')) {
      const reason = prompt('Please provide a reason for reporting:');
      if (reason) {
        reviewApi.reportReview(review.id, { reason })
          .then(() => {
            alert('Review reported successfully');
          })
          .catch((error) => {
            console.error('Error reporting review:', error);
            alert('Failed to report review');
          });
      }
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      if (onDelete) onDelete(review.id);
    }
    setShowMenu(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? '#f59e0b' : '#e5e7eb'}
        fill={index < rating ? '#f59e0b' : 'none'}
      />
    ));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    transition: 'box-shadow 0.2s',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  };

  const userInfoStyle = {
    display: 'flex',
    gap: '12px',
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  };

  const avatarImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const avatarTextStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#3b82f6',
  };

  const userNameStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 4px 0',
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const starsStyle = {
    display: 'flex',
    gap: '2px',
  };

  const dateStyle = {
    fontSize: '13px',
    color: '#94a3b8',
  };

  const menuContainerStyle = {
    position: 'relative',
  };

  const menuButtonStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'background-color 0.2s',
  };

  const menuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    minWidth: '140px',
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const menuItemDangerStyle = {
    color: '#dc2626',
  };

  const commentStyle = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#334155',
    marginBottom: '16px',
    whiteSpace: 'pre-wrap',
  };

  const responseContainerStyle = {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  };

  const responseHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const responseLabelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#3b82f6',
  };

  const responseDateStyle = {
    fontSize: '12px',
    color: '#94a3b8',
  };

  const responseTextStyle = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0,
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  };

  const likeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: isLiked ? '#3b82f6' : '#64748b',
  };

  const userName = review.user_name || review.user?.name || review.userName || 'Anonymous';

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={userInfoStyle}>
          <div style={avatarStyle}>
            {review.user?.avatar ? (
              <img
                src={review.user.avatar}
                alt={userName}
                style={avatarImgStyle}
              />
            ) : (
              <span style={avatarTextStyle}>
                {getInitials(userName)}
              </span>
            )}
          </div>
          <div>
            <h4 style={userNameStyle}>{userName}</h4>
            <div style={metaStyle}>
              <div style={starsStyle}>{renderStars(review.rating)}</div>
              <span style={dateStyle}>{formatDate(review.created_at || review.createdAt)}</span>
            </div>
          </div>
        </div>

        <div style={menuContainerStyle}>
          <button
            style={menuButtonStyle}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div style={menuStyle}>
              <button style={menuItemStyle} onClick={handleReport}>
                <Flag size={16} />
                Report
              </button>
              {canDelete && (
                <button
                  style={{ ...menuItemStyle, ...menuItemDangerStyle }}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={commentStyle}>{review.comment || review.comment}</p>

      {review.host_response && (
        <div style={responseContainerStyle}>
          <div style={responseHeaderStyle}>
            <span style={responseLabelStyle}>Response from host</span>
            <span style={responseDateStyle}>
              {formatDate(review.host_response.created_at || review.host_response.createdAt)}
            </span>
          </div>
          <p style={responseTextStyle}>{review.host_response.text || review.host_response.comment}</p>
        </div>
      )}

      <div style={footerStyle}>
        <button
          style={likeButtonStyle}
          onClick={handleLike}
        >
          <ThumbsUp
            size={16}
            fill={isLiked ? '#3b82f6' : 'none'}
            color={isLiked ? '#3b82f6' : '#64748b'}
          />
          <span>Helpful ({likeCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;

