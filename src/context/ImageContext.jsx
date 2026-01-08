import React, { createContext, useEffect, useState } from "react";
import { auth } from "../lib/helper/firebaseClient";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(() => {
    // Default placeholder image
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACUCAMAAAAqEXLeAAAAMFBMVEXr6+urq6vu7u6oqKiurq6/v7/o6Ojb29vl5eXi4uKxsbHPz8+5ubnW1ta2trbHx8fEKo03AAAEHklEQVR4nO2cDbKrIAyFlV8VkP3v9qG+3lpbLRA52BnPCr4BEpKQ0DS3bt26devWn5RSXd/3nVK1ST4qkGnn5TgI671xgbM20ZuUs14OLedt2w7jaKUMoDqQstpkT3VetGIC/FPAFUOA9Vqxa4B2tt2VGKXpL4CpLN+HnBaVS93VhjRHiAtna11XcTlZ0x9s9hNTSF0NUQevIyIgg0ZXh1HLSMBFvgJi7/mhxbzvuYd7+F6mIVah7MdUxiADhvQZjO2AtXGXZDMP8RHp1rv0E7lQIjdcZy3kJOCGu7yFDEspcfejz4VsBW4p8+xmloRB5p/JduxRkN/js32hDFxleqBJ3IKWUuXciQ+hTKfLP5I4h67zdzvIYoKhbF8+S0AucEaD5JBDSYV0iKuRCmkg9zfNcLjHQFIYUZFQ/wuQ3fADkCqmtlIdMj/obWGG0xgSJMYFNY7ACHLmpMgcdS1mFln+IEFRb25xYNaAKmMQkhwuUcU1ne/OYaUWdvQu8kWDBj1COZ9vOUJKDaBkhuKBpgog4FQyim3Piwlw54ziJWGQpEgtCFHwpa4kJFZjpHASFGFQDUdAUlpSOAnLcUiHEhX0UoqouHiS5IRQVdQ7njxLhHgS91ZLSHKAT7UyGxL1+jD1iGRDInsxcvcb+TCffTXi3hYnHbd/7YiDOxyUt6mpjnWQHOxVqSYuG3zLWvK5rNFk1fRpkIj8612JGRki3f4AmVaWBpWht5BJT2OoCu9WSc8QolZfd4J9ox4d3pUQsqFSmw+KL7BhL+0XRS8lsLXqXZGNlFxWbDZnsSkZugv1BTK2ba2Sk0yCrHNvJ0IOlZrhF8jIM/kTkHW3O9q6a47lxDacy4rTLio6z7G1NpxN82GR4qKSPzdtWmheIaJMnyTBp4t9RmUNbeNR02Fbod1lXtlcAG8epcfc0r7UEPNhSntCD4aQpniHA+ucpL0lcz4EzoKYrDdWEBsHZg1el6qxZQzZHXCaAqczLGLaDfNNYdvdmflZOIl+PBdxxmzD6Txp25k28pST+Alz8I5u7MHjpE3NJkuMhrSaKhDyxKnZDPFsH8+a3nlbnvCBaZIf9BbCQgdxB9OmnU6mgjEjCf9LyPjJ/45wN1M1+CjXGaJZ/Bo+NX+k8A3RDDURF0xpDnfdUFv6TtH0e8YeIYtPo0uLj3vBnK6+0yvtvDpfivHzXD3Lz1vK6OPLz8UY209z9aQhmyJ6b2IkTYYU0jZLV1k/W5TWpq9NX8KJb7VxQ6RhpXIyr7t9ObOZZde+kjSrVFLr/aZNnpbTy/QOrSu7nPj6mfyiR/K1c+PMGs+pWndF1MtpvmjVOk/6NKKoVqFQYtcZUE9I4i8CJfWMhH4D8qpu8vcgL+vL15CX9eU35GlaQ9Zm2dUKkjiJWFAL5D+bFD6YCjvh7wAAAABJRU5ErkJggg==";
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark-theme" : "light-theme";
  });

  // Update user-specific avatar in localStorage when image changes
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.email && image) {
      const storageKey = `profileImage_${currentUser.email}`;
      localStorage.setItem(storageKey, image);
    }
  }, [image]);

  // Load user-specific avatar on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        const storageKey = `profileImage_${user.email}`;
        const storedImage = localStorage.getItem(storageKey);
        if (storedImage) {
          setImage(storedImage);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <ImageContext.Provider value={{ image, setImage, theme, setTheme }}>
      {children}
    </ImageContext.Provider>
  );
};
