import React, { useState } from 'react';
import { useBookingContext } from '../../context/BookingContext';

const CustomerDetails = () => {
  const { bookingData, updateBookingData, nextStep, prevStep, isStep3Valid } = useBookingContext();
  
  // Local state för formulärvalidering
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validering av email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email krävs';
    if (!emailRegex.test(email)) return 'Ange en giltig email-adress';
    return null;
  };

  // Validering av telefonnummer
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,15}$/;
    if (!phone) return 'Telefonnummer krävs';
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Ange ett giltigt telefonnummer';
    return null;
  };

  // Validering av namn
  const validateName = (name) => {
    if (!name || name.trim().length < 2) return 'Namn måste vara minst 2 tecken';
    if (name.trim().length > 100) return 'Namn får inte vara längre än 100 tecken';
    return null;
  };

  // Handle input changes med validering
  const handleInputChange = (field, value) => {
    // Clear previous error för detta fält
    setErrors(prev => ({ ...prev, [field]: null }));
    
    // Validera baserat på fält
    let error = null;
    if (field === 'customerName' && value) {
      error = validateName(value);
    } else if (field === 'email' && value) {
      error = validateEmail(value);
    } else if (field === 'phoneNumber' && value) {
      error = validatePhoneNumber(value);
    }

    // Sätt error om det finns
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    // Uppdatera booking data
    updateBookingData({ [field]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Kör alla valideringar
    const newErrors = {};
    
    const nameError = validateName(bookingData.customerName);
    if (nameError) newErrors.customerName = nameError;

    const emailError = validateEmail(bookingData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhoneNumber(bookingData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    setErrors(newErrors);

    // Om inga fel, gå vidare till bekräftelse
    if (Object.keys(newErrors).length === 0 && isStep3Valid()) {
      // Simulera en kort delay för användarupplevelse
      setTimeout(() => {
        setIsSubmitting(false);
        nextStep();
      }, 500);
    } else {
      setIsSubmitting(false);
    }
  };

  // Formatera telefonnummer medan användaren skriver
  const formatPhoneNumber = (value) => {
    // Ta bort alla icke-numeriska tecken
    const numbers = value.replace(/[^\d]/g, '');
    
    // Formatera baserat på längd
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Kontaktuppgifter
        </h2>
        <p className="text-gray-600">
          Fyll i dina kontaktuppgifter för att slutföra bokningen
        </p>
      </div>

      {/* Bokningssammanfattning */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Din bokning:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <span className="font-medium">Datum:</span><br />
            {new Date(bookingData.date).toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div>
            <span className="font-medium">Tid:</span><br />
            {bookingData.time} - {
              new Date(`2000-01-01T${bookingData.time}`).getHours() + 2
            }:{new Date(`2000-01-01T${bookingData.time}`).getMinutes().toString().padStart(2, '0')}
          </div>
          <div>
            <span className="font-medium">Bord:</span><br />
            Bord {bookingData.selectedTable?.tableNumber} ({bookingData.numberOfGuests} personer)
          </div>
        </div>
      </div>

      {/* Kontaktformulär */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Namn */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Fullständigt namn *
          </label>
          <input
            type="text"
            id="customerName"
            value={bookingData.customerName || ''}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="För- och efternamn"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.customerName ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email-adress *
          </label>
          <input
            type="email"
            id="email"
            value={bookingData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="din.email@exempel.se"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.email ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Vi använder din email för bokningsbekräftelse och eventuella ändringar
          </p>
        </div>

        {/* Telefonnummer */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={bookingData.phoneNumber || ''}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              handleInputChange('phoneNumber', formatted);
            }}
            placeholder="070-123-45-67"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Vi kan behöva kontakta dig om det blir ändringar
          </p>
        </div>

        {/* Specialönskemål (valfritt) */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Specialönskemål eller allergier (valfritt)
          </label>
          <textarea
            id="specialRequests"
            value={bookingData.specialRequests || ''}
            onChange={(e) => updateBookingData({ specialRequests: e.target.value })}
            placeholder="T.ex. allergi mot nötter, barnstol behövs, firande..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {(bookingData.specialRequests || '').length}/500 tecken
          </p>
        </div>

        {/* Bekräftelse av villkor */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Viktigt att veta:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Bokningen gäller i 2 timmar från angiven tid</li>
            <li>• Avbokning kan göras fram till 2 timmar innan bokad tid</li>
            <li>• Vid förseningar på över 15 minuter kan bordet frigöras</li>
            <li>• Bekräftelse skickas till angiven email-adress</li>
          </ul>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Tillbaka
          </button>
          
          <button
            type="submit"
            disabled={!isStep3Valid() || isSubmitting}
            className={`
              px-8 py-3 rounded-lg transition-colors font-medium
              ${isStep3Valid() && !isSubmitting
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Slutför bokning...
              </span>
            ) : (
              'Slutför bokning →'
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default CustomerDetails;