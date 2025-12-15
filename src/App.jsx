import React, { useState, useEffect, useRef } from 'react'
import './App.css'

// Helper function to try multiple image formats
function useImageSource(baseName) {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const formats = ['.png', '.jpg', '.jpeg'];
    let currentIndex = 0;

    const tryNextFormat = () => {
      if (currentIndex >= formats.length) {
        setError(true);
        return;
      }

      const img = new Image();
      const testSrc = `/images/${baseName}${formats[currentIndex]}`;
      
      img.onload = () => {
        setSrc(testSrc);
      };
      
      img.onerror = () => {
        currentIndex++;
        tryNextFormat();
      };
      
      img.src = testSrc;
    };

    tryNextFormat();
  }, [baseName]);

  return { src, error };
}

function ImageWithFallback({ baseName, alt, className, isCertificate = false, onImageClick }) {
  const { src, error } = useImageSource(baseName);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (error) {
      setShowPlaceholder(true);
    }
  }, [error]);

  if (showPlaceholder || !src) {
    return (
      <div className={`image-placeholder ${isCertificate ? 'certificate-placeholder' : ''}`} style={{display: showPlaceholder ? 'flex' : 'none'}}>
        <p>{alt}</p>
        <p className="image-note">[এখানে একটি ছবি যোগ হবে]</p>
      </div>
    );
  }

  if (isCertificate) {
    return (
      <div className="image-wrapper certificate-image-wrapper">
        <img 
          src={src} 
          alt={alt} 
          className={className}
          onError={() => setShowPlaceholder(true)}
          onClick={onImageClick}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="image-wrapper">
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={() => setShowPlaceholder(true)}
        loading="lazy"
      />
    </div>
  );
}

function CertificateZoomModal({ src, alt, isOpen, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleWheel = (e) => {
    if (!isOpen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 5);
    setScale(newScale);
  };

  const handleDoubleClick = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2);
      }
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (imageRef.current && imageRef.current.lastDistance) {
        const scaleChange = distance / imageRef.current.lastDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, 0.5), 5);
        setScale(newScale);
      }
      imageRef.current.lastDistance = distance;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (imageRef.current) {
      imageRef.current.lastDistance = null;
    }
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.5, 5);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.5, 0.5);
    setScale(newScale);
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="zoom-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="zoom-modal-content" ref={containerRef}>
        <button className="zoom-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomIn} aria-label="Zoom In">
            +
          </button>
          <button className="zoom-btn" onClick={resetZoom} aria-label="Reset Zoom">
            ⟲
          </button>
          <button className="zoom-btn" onClick={zoomOut} aria-label="Zoom Out">
            −
          </button>
        </div>
        <div 
          className="zoom-image-container"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          onDoubleClick={handleDoubleClick}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className="zoom-image"
            draggable={false}
          />
        </div>
        <div className="zoom-hint">
          <p>ডাবল ক্লিক করুন বা পিঞ্চ করুন জুম করতে</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [certificateSrc, setCertificateSrc] = useState(null);

  const handleCertificateClick = (src) => {
    setCertificateSrc(src);
    setIsZoomOpen(true);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="images-row">
            <div className="image-container">
              <ImageWithFallback 
                baseName="shahidul-islam-babu"
                alt="শাহিদুল ইসলাম বাবু"
                className="profile-image"
              />
              <p className="image-name">শাহিদুল ইসলাম বাবু</p>
            </div>
            
            <div className="image-container">
              <ImageWithFallback 
                baseName="masum-shahriar-rahman-naim"
                alt="মাসুম শাহরিয়ার রহমান নাইম"
                className="profile-image"
              />
              <p className="image-name">মাসুম শাহরিয়ার রহমান নাইম</p>
            </div>
          </div>
        </header>

        <main className="content">
          <div className="declaration">
            <p className="intro-text">
              আমরা <strong>শাহিদুল ইসলাম বাবু</strong> এবং <strong>মাসুম শাহরিয়ার রহমান নাইম</strong> পাগাড় বড় মসজিদ থেকে সনাক্তকারী অফিসার হিসেবে ঘোষণা করিতেছি যে <strong>ইশতিয়াক আহমেদ আদনান</strong> অর্জিত সমস্ত ধন-সম্পদ ব্যাংক ব্যালেন্স এবং পকেটের সর্বশেষ খুচরা পয়সাটি নিঃশেষ করিয়াছেন | তার বর্তমান পরিস্থিতি জিরো ব্যালেন্স অথবা দেউলিয়া রূপে মানিয়া লইলাম | একতায় তাকে ফকির বলা চলে | 
            </p>

            <p className="promise-text">
              অতএব আমরা <strong>শাহিদুল ইসলাম বাবু</strong> এবং <strong>মাসুম শাহরিয়ার রহমান নাইম</strong> আজ <strong>১৫ ই ডিসেম্বর ২০২৫</strong> রোজ <strong>সোমবার</strong> ওয়াদা বদ্ধ হইতেছে যে এখন থেকে ইশতিয়াক আহমেদ আদনান কোন প্রকার টাকা পয়সার বিষয়ে কোনো কথা জিজ্ঞেস করবো না এবং তাকে কোন প্রকার প্রেসার দিব না এবং উস্কা দিব না | আমরা আবারও ওয়াদাবদ্ধ হইতেছি যে আমরা কোন প্রকার টাকা-পয়সার বিষয়ে উস্কা দিব না এবং যদি অন্য কেউ দেয় তার বিরুদ্ধেও পদক্ষেপ গ্রহণ করিব |
            </p>

            <p className="additional-promise">
              এবং আমরা আরো ওয়াদাবদ্ধ হইতেছি যে যেই পর্যন্ত সে নিজে না বলবে সেই পর্যন্ত আমরা কোন প্রকার এই বিষয় নিয়ে কথা বলবো না | এবং কেউ এই বিষয় নিয়ে কথা বলতে চাইলে আমরা তার বিরুদ্ধেও পদক্ষেপ গ্রহণ করিব |
            </p>

            <p className="certificate-intro">
              অতএব নিচে তার ফকির সনদপত্রটি যোগ করা হলো | <span className="click-hint">(ক্লিক করে বড় করে দেখুন)</span>
            </p>
          </div>

          <div className="certificate-section">
            <div className="certificate-wrapper">
              <CertificateImageWithZoom 
                baseName="sonodpotro"
                alt="ফকির সনদপত্র"
                onImageClick={handleCertificateClick}
              />
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>শাহিদুল ইসলাম বাবু</p>
          <p>মাসুম শাহরিয়ার রহমান নাইম</p>
          <p className="date">১৫ ই ডিসেম্বর ২০২৫, সোমবার</p>
        </footer>
      </div>

      {certificateSrc && (
        <CertificateZoomModal
          src={certificateSrc}
          alt="ফকির সনদপত্র"
          isOpen={isZoomOpen}
          onClose={() => {
            setIsZoomOpen(false);
            setCertificateSrc(null);
          }}
        />
      )}
    </div>
  )
}

function CertificateImageWithZoom({ baseName, alt, onImageClick }) {
  const { src, error } = useImageSource(baseName);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (error) {
      setShowPlaceholder(true);
    }
  }, [error]);

  if (showPlaceholder || !src) {
    return (
      <div className="image-placeholder certificate-placeholder" style={{display: showPlaceholder ? 'flex' : 'none'}}>
        <p>{alt}</p>
        <p className="image-note">[এখানে একটি ছবি যোগ হবে]</p>
      </div>
    );
  }

  return (
    <div className="image-wrapper certificate-image-wrapper">
      <img 
        src={src} 
        alt={alt} 
        className="certificate-image"
        onError={() => setShowPlaceholder(true)}
        onClick={() => onImageClick(src)}
        loading="lazy"
      />
    </div>
  );
}

export default App

