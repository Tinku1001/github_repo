import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <Loader2 className="loading-spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;