const fs = require('fs');
let content = fs.readFileSync('src/components/FarmModal.tsx', 'utf8');

const newGetLocation = `  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({ type: 'error', text: t.locationDenied || 'Geolocation is not supported by your browser.' });
      return;
    }
    setLocating(true);
    setGeoMsg({ type: 'success', text: 'Locating...' });
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const acc = Math.round(pos.coords.accuracy);
        setLatitude(lat);
        setLongitude(lng);
        
        try {
          const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}&zoom=14&addressdetails=1\`);
          const data = await res.json();
          
          if (data && data.address) {
             const addrCountryCode = data.address.country_code ? data.address.country_code.toUpperCase() : '';
             
             if (addrCountryCode && addrCountryCode !== countryAdapter.countryCode) {
               setGeoMsg({
                 type: 'error',
                 text: \`Your GPS location appears to be outside the selected country (\${countryAdapter.countryName}). Please change country.\`
               });
               setLocating(false);
               return;
             }
             
             const region = data.address.state || data.address.region || data.address.province || data.address.county || '';
             const district = data.address.city_district || data.address.district || data.address.county || data.address.city || data.address.town || data.address.village || '';
             
             if (region) setStateRegion(region);
             if (district) setLocationName(district);
             
             setGeoMsg({
               type: 'success',
               text: \`GPS Location Acquired (Accuracy: ±\${acc}m)\`
             });
          } else {
             setGeoMsg({
               type: 'success',
               text: \`GPS Acquired (Accuracy: ±\${acc}m). Could not reverse-geocode.\`
             });
          }
        } catch (err) {
          setGeoMsg({
            type: 'success',
            text: \`GPS Acquired (Accuracy: ±\${acc}m) - Reverse geocoding failed.\`
          });
        }
        
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoMsg({ type: 'error', text: t.locationDenied || 'Location permission denied. Manual entry enabled.' });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };`;

content = content.replace(/  const handleGetLocation = \(\) => \{[\s\S]*?(?=  const handleSubmit = async)/, newGetLocation + '\n');

fs.writeFileSync('src/components/FarmModal.tsx', content);
