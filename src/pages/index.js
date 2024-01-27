// pages/ImageGallery.js
import { useEffect, useState } from 'react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/getImages');
        const data = await res.json();
        console.log(data);
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.key} className="max-w-sm rounded overflow-hidden shadow-lg">
              <img className="w-full" src={image.url} alt="Image" />
              <div className="px-6 py-4">
                <p className="text-gray-700 text-base">
                  {image.key}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
