"use client"
import { VerticalAlignTop } from '@mui/icons-material';
import React, { useEffect } from 'react';
import  "./scroll.css";

const ScrollTop = () => {
  useEffect(() => {
    const backToTop = document.querySelector('.back_to_top');
    const onScroll = () => {
      if (window.pageYOffset > 100) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    };

    window.addEventListener('scroll', onScroll);
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      backToTop.removeEventListener('click', () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    };
  }, []);
  return (
    <div className="back_to_top bg-gradient-to-r from-or_color2 to-or_color">
    <VerticalAlignTop style={{fontSize:"17px" , color:"white"}}/>
    </div>


  );
}

export default ScrollTop;
