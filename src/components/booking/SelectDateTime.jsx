
import React, { useState } from 'react';
import { useBookingContext } from '../../context/BookingContext';

const SelectDateTime = () => {
  const { bookingData, updateBookingData, nextStep, isStep1Valid } = useBookingContext();
  
  // Local state för formulärvalidering
  const [errors, setErrors] = useState({});

  // Validering av datum (måste vara i framtiden)
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Datum måste vara idag eller i framtiden';
    }
    return null;
  };

  // Validering av tid (restaurang öppen 10:00-21:00)
  const validateTime = (time) => {
    const [hours] = time.split(':').map(Number);
    
    if (hours < 10) {
      return 'Restaurangen öppnar kl 10:00';
    }
    if (hours > 21) {
      return 'Sista bokning är kl 21:00';
    }
    return null;
  };

  // Handle input changes med validering
  const handleInputChange = (field, value) => {
    // Clear previous error för detta fält
    setErrors(prev => ({ ...prev, [field]: null }));
    
    // Validera baserat på fält
    let error = null;
    if (field === 'date' && value) {
      error = validateDate(value);
    } else if (field === 'time' && value) {
      error = validateTime(value);
    } else if (field === 'numberOfGuests') {
      const guests = parseInt(value);
      if (guests < 1 || guests > 20) {
        error = 'Antal gäster måste vara mellan 1 och 20';
      }
    }

    // Sätt error om det finns
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    // Uppdatera booking data
    updateBookingData({ [field]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kör alla valideringar
    const newErrors = {};
    
    if (!bookingData.date) {
      newErrors.date = 'Datum krävs';
    } else {
      const dateError = validateDate(bookingData.date);
      if (dateError) newErrors.date = dateError;
    }

    if (!bookingData.time) {
      newErrors.time = 'Tid krävs';
    } else {
      const timeError = validateTime(bookingData.time);
      if (timeError) newErrors.time = timeError;
    }

    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1 || bookingData.numberOfGuests > 20) {
      newErrors.numberOfGuests = 'Antal gäster måste vara mellan 1 och 20';
    }

    setErrors(newErrors);

    // Om inga fel, gå vidare
    if (Object.keys(newErrors).length === 0 && isStep1Valid()) {
      nextStep();
    }
  };

  // Generera dagens datum som minimum
  const today = new Date().toISOString().split('T')[0];

  // Generera tidslots (10:00-21:00, varje halvtimme)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Välj datum och tid
        </h2>
        <p className="text-gray-600">
          Välj när du vill boka bord på vår restaurang
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Datum */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Datum
          </label>
          <input
            type="date"
            id="date"
            value={bookingData.date}
            min={today}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.date ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Tid */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Tid
          </label>
          <select
            id="time"
            value={bookingData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.time ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          >
            <option value="">Välj tid</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Restaurangen är öppen 10:00-23:00. Varje bokning varar 2 timmar.
          </p>
        </div>

        {/* Antal gäster */}
        <div>
          <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
            Antal gäster
          </label>
          <select
            id="numberOfGuests"
            value={bookingData.numberOfGuests}
            onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.numberOfGuests ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'person' : 'personer'}
              </option>
            ))}
          </select>
          {errors.numberOfGuests && (
            <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests}</p>
          )}
        </div>

        {/* Sammanfattning av vald data */}
        {bookingData.date && bookingData.time && bookingData.numberOfGuests && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Din bokning:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>📅 {new Date(bookingData.date).toLocaleDateString('sv-SE')}</li>
              <li>⏰ {bookingData.time}</li>
              <li>👥 {bookingData.numberOfGuests} {bookingData.numberOfGuests === 1 ? 'person' : 'personer'}</li>
              <li className="text-xs text-blue-600 mt-2">
                💡 Bokningen varar till kl {
                  new Date(`2000-01-01T${bookingData.time}`).getHours() + 2
                }:{new Date(`2000-01-01T${bookingData.time}`).getMinutes().toString().padStart(2, '0')}
              </li>
            </ul>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isStep1Valid()}
            className={`
              px-6 py-2 rounded-lg transition-colors
              ${isStep1Valid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Fortsätt →
          </button>
        </div>
      </form>

      {/* Debug information (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              bookingData: {
                date: bookingData.date,
                time: bookingData.time,
                numberOfGuests: bookingData.numberOfGuests,
              },
              errors: errors,
              isValid: isStep1Valid()
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SelectDateTime;