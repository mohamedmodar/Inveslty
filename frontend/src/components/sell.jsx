import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SellPropertyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    district: 'Smouha',
    rooms: 3,
    baths: 2,
    'Size in Meters': 150,
    floor: 10,
    'Finish Type': 'Super Lux',
    'View': 'Sea View',
    'Year Built': 2018,
  });
  const [loading, setLoading] = useState(false);

  // Hardcoded options from the provided CSV and backend logic
  const districts = [
    "Abu talat", "Al asafra", "Bakoos", "Bolekly", "Borg el arab", "Camp cesar", "Chatby",
    "Cleopatra", "El amreya", "El hanouvel", "El mamoura", "El mandara", "Fleming", "Ganaklis",
    "Glim", "Kafr-abdo", "King maryot", "Lauren", "Mansheya", "Miami",
    "Moharram bey", "Montazah", "Roshdy", "Saba basha", "San stefano", "Sidi bishr", "Sidi gaber", "Smouha",
    "Sporting", "Stanley", "Zezenia"
  ];
  const finishTypes = ["Super Lux", "Lux", "Not Finished", "Semi Finished", "Extra Super Lux", "Without Finish"];
  const viewTypes = ["Sea View", "Street View", "Garden View", "Main Street", "Side Street", "Back", "Open View", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle numeric fields
    const numericFields = ['rooms', 'baths', 'Size in Meters', 'floor', 'Year Built'];
    if (numericFields.includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/predict-apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Something went wrong');
      }

      const result = await response.json();
      // Redirect to result page with the prediction
      navigate('/sell-result', { state: { prediction: result.predicted_price } });

    } catch (err) {
      // Redirect to result page with the error
      navigate('/sell-result', { state: { error: err.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-4">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-black text-center mb-2">Sell Your Property</h1>
          <p className="text-lg text-gray-700 text-center mb-6">
            Provide the details of your property to get an estimated market price instantly.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* District */}
            <div className="form-group">
              <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2">District:</label>
              <select name="district" value={formData.district} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Rooms and Baths (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="rooms" className="block text-gray-700 text-sm font-bold mb-2">Rooms:</label>
                <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"/>
              </div>
              <div className="form-group">
                  <label htmlFor="baths" className="block text-gray-700 text-sm font-bold mb-2">Baths:</label>
                  <input type="number" name="baths" value={formData.baths} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"/>
              </div>
            </div>

            {/* Size and Floor (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                  <label htmlFor="Size in Meters" className="block text-gray-700 text-sm font-bold mb-2">Size (sqm):</label>
                  <input type="number" name="Size in Meters" value={formData['Size in Meters']} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"/>
              </div>
              <div className="form-group">
                  <label htmlFor="floor" className="block text-gray-700 text-sm font-bold mb-2">Floor:</label>
                  <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"/>
              </div>
            </div>

            {/* Finish Type */}
            <div className="form-group">
              <label htmlFor="Finish Type" className="block text-gray-700 text-sm font-bold mb-2">Finish Type:</label>
              <select name="Finish Type" value={formData['Finish Type']} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700">
                {finishTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
              </select>
            </div>

            {/* View */}
            <div className="form-group">
              <label htmlFor="View" className="block text-gray-700 text-sm font-bold mb-2">View:</label>
              <select name="View" value={formData['View']} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700">
                {viewTypes.map(vt => <option key={vt} value={vt}>{vt}</option>)}
              </select>
            </div>
            
            {/* Year Built */}
            <div className="form-group">
                <label htmlFor="Year Built" className="block text-gray-700 text-sm font-bold mb-2">Year Built:</label>
                <input type="number" name="Year Built" value={formData['Year Built']} onChange={handleChange} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"/>
            </div>

            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mx-auto block w-full text-lg" disabled={loading}>
              {loading ? 'Estimating...' : 'Get Estimated Price'}
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-green-500 text-white text-center py-3">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SellPropertyPage;
