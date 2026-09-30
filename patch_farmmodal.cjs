const fs = require('fs');
let content = fs.readFileSync('src/components/FarmModal.tsx', 'utf8');

// Import useCountry
content = content.replace("import { useAuth } from '../context/AuthContext';", "import { useAuth } from '../context/AuthContext';\nimport { useCountry } from '../context/CountryContext';");

// Inside component
content = content.replace("  const {", "  const { activeCountry, countryAdapter } = useCountry();\n  const {");

// Default state changes
content = content.replace(/setCountry\('India'\);/g, "setCountry(activeCountry);");
content = content.replace(/setStateRegion\('Punjab'\);/g, "setStateRegion('');");
content = content.replace(/setLocationName\('Ludhiana'\);/g, "setLocationName('');");
content = content.replace(/setLatitude\(30\.901\);/g, "setLatitude(null);");
content = content.replace(/setLongitude\(75\.8573\);/g, "setLongitude(null);");

// Location field section replacement
const oldLocationFieldsRegex = /\{\/\* Country \*\/\}.*?\{\/\* Farm Area & Unit \*\/\}/s;
const newLocationFields = `{/* Country (Read-Only) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.countryLabel || 'Country'}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  readOnly
                  value={\`\${countryAdapter.countryName} (\${countryAdapter.countryCode})\`}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            {/* State / Region / Province */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                State / Region / Province
              </label>
              {countryAdapter.regions && countryAdapter.regions.length > 0 ? (
                <select
                  value={stateRegion}
                  onChange={(e) => {
                    setStateRegion(e.target.value);
                    const selectedRegion = countryAdapter.regions.find(r => r.name === e.target.value);
                    if (selectedRegion && selectedRegion.districts.length > 0) {
                      setLocationName(selectedRegion.districts[0]);
                    } else {
                      setLocationName('');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Region</option>
                  {countryAdapter.regions.map((r) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. State, Province..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>

            {/* Location / District & GPS */}
            <div className="md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t.locationNameLabel || 'District / Locality'} *
                </label>
                <button
                  type="button"
                  id="use-my-location-btn"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                >
                  {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                  <span>Use Live Location (GPS)</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                
                {countryAdapter.regions && countryAdapter.regions.find(r => r.name === stateRegion)?.districts ? (
                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select District</option>
                    {countryAdapter.regions.find(r => r.name === stateRegion)?.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Search / Enter District or City"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
              {geoMsg && (
                <div className={\`mt-1.5 text-[11px] flex flex-col gap-1 \${geoMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}\`}>
                  <div className="flex items-center gap-1.5">
                    {geoMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>{geoMsg.text}</span>
                  </div>
                  {geoMsg.type === 'success' && latitude && longitude && (
                    <div className="text-[10px] pl-5 opacity-80">
                      Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Farm Area & Unit */}`;

content = content.replace(oldLocationFieldsRegex, newLocationFields);

// Also replace the hardcoded "Wheat" etc for crops with the adapter's options
const oldCropFieldsRegex = /\{\/\* Crop \*\/\}.*?\{\/\* Crop Variety \*\/\}/s;
const newCropFields = `{/* Crop */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.cropLabel || 'Crop'} *
              </label>
              {countryAdapter.cropCatalog && countryAdapter.cropCatalog.length > 0 ? (
                <select
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Crop</option>
                  {countryAdapter.cropCatalog.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Wheat, Rice, Soybean, Cotton"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
            
            {/* Crop Variety */}`;
content = content.replace(oldCropFieldsRegex, newCropFields);


// Soil Type
const oldSoilRegex = /\{\/\* Soil Type \*\/\}.*?\{\/\* Irrigation Type \*\/\}/s;
const newSoilFields = `{/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.soilTypeLabel || 'Soil Type'}
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                {countryAdapter.soilTypes && countryAdapter.soilTypes.length > 0 ? (
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {countryAdapter.soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            </div>
            {/* Irrigation Type */}`;
content = content.replace(oldSoilRegex, newSoilFields);


// Irrigation
const oldIrrigationRegex = /\{\/\* Irrigation Type \*\/\}.*?<\/div>\s*<div className="pt-4 flex items-center justify-end/s;
const newIrrigationFields = `{/* Irrigation Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.irrigationTypeLabel || 'Irrigation Type'}
              </label>
              <div className="relative">
                <Droplets className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                {countryAdapter.irrigationTypes && countryAdapter.irrigationTypes.length > 0 ? (
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {countryAdapter.irrigationTypes.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end`;
content = content.replace(oldIrrigationRegex, newIrrigationFields);

fs.writeFileSync('src/components/FarmModal.tsx', content);
