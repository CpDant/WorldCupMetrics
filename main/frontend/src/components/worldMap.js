import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import useGeoData from './useGeoData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import './worldMap.css';
import L from 'leaflet';

const WorldMap = () => {
  const { geoData, loading, error } = useGeoData('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  const [winsData, setWinsData] = useState({});
  const position = [20, 0]; // Map center

  useEffect(() => {
    const fetchWinsData = async () => {
      try {
        const response = await axios.get('/api/worldcupwins');
        const data = response.data;
        const wins = {};
        data.forEach(item => {
          wins[item.country] = item.wins;
        });
        setWinsData(wins);
        console.log('Wins data fetched:', wins);
      } catch (error) {
        console.error("Error fetching wins data: ", error);
        toast.error("Error fetching wins data");
      }
    };

    fetchWinsData();
  }, []);

  const getColor = (wins) => {
    return wins > 4 ? '#0B3D0B' :
           wins > 3 ? '#146814' :
           wins > 2 ? '#198C19' :
           wins > 1 ? '#32A852' :
           wins > 0 ? '#66CDAA' :
                      '#E6E6E6';
  };

  const styleFeature = (feature) => {
    const countryName = feature.properties.ADMIN;
    const wins = winsData[countryName] || 0;
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(wins)
    };
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.9,
      fillColor: layer.options.fillColor
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    const country = layer.feature;
    layer.setStyle(styleFeature(country));
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    layer.on({
      click: (e) => {
        const wins = winsData[countryName] || 0;
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        layer.bindPopup(`<div class="custom-popup"><b>${countryName}</b><br/>World Cup wins: ${wins}</div>`)
             .openPopup();
        e.target._map.setView(center, e.target._map.getZoom());
      },
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading the map data.</div>;

  return (
    <>
      <ToastContainer />
      <MapContainer center={position} zoom={2} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachCountry} style={styleFeature} />}
      </MapContainer>
    </>
  );
};

export default WorldMap;
