"use client"
import React, { useEffect, useRef, useState } from 'react'
import Search from '../elements/Search'

export default function SearchComponent() {
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const [parentDivSize, setParentDivSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (parentDivRef.current) {
        const width = parentDivRef.current.offsetWidth;
        setParentDivSize(width);
      }
    };

    // Đăng ký sự kiện resize
    window.addEventListener('resize', handleResize);

    handleResize();
    // Khi component unmount, hủy đăng ký sự kiện resize
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [parentDivRef]);

  return (
    <div
      className='flex md:!hidden'
    >
      <div ref={parentDivRef} className="relative w-full my-4">
        <Search width={parentDivSize} />
      </div>
    </div>
  )
}
