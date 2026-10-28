import React from 'react';

const LiveEarthView = () => {
  const videoId = 'xRPjKQtRXR8'; // New video ID for the live video you want to display

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md">
      <h2 className="text-xl font-bold text-center mb-2">Live View from ISS</h2>
      <iframe
        width="100%"
        height="80%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
        title="YouTube video player"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LiveEarthView;
