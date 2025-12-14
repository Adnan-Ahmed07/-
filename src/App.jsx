import React, { useState, useEffect } from 'react'
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

function ImageWithFallback({ baseName, alt, className, isCertificate = false }) {
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

function App() {
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
              অতএব নিচে তার ফকির সনদপত্রটি যোগ করা হলো |
            </p>
          </div>

          <div className="certificate-section">
            <div className="certificate-wrapper">
              <ImageWithFallback 
                baseName="sonodpotro"
                alt="ফকির সনদপত্র"
                className="certificate-image"
                isCertificate={true}
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
    </div>
  )
}

export default App

