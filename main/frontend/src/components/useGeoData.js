import { useState, useEffect } from 'react';
import axios from 'axios';

const useGeoData = (url) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setGeoData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading GeoJSON data: ", error);
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { geoData, loading, error };
};

export default useGeoData;
