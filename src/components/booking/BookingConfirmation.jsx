import React, { useState, useEffect, useRef } from 'react';
import { useBookingContext } from '../../context/BookingContext';
import bookingService from '../../services/bookingService';

const BookingConfirmation = () => {
  const { bookingData, getBookingForAPI, resetBooking } = useBookingContext();
  const hasSubmittedRef = useRef(false); // Använd useRef för att tracka om vi redan skickat
  
  const [confirmationState, setConfirmationState] = useState({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    confirmationNumber: null,
  });

  // Skicka bokningen när komponenten laddas
  useEffect(() => {
    // Kolla om vi redan har skickat för att undvika dubbletter
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true; // Sätt direkt för att blockera dubbletter
      submitBooking();
    }
  }, []); // Tom array = kör bara en gång

  const submitBooking = async () => {
    try {
      setConfirmationState(prev => ({ 
        ...prev, 
        isSubmitting: true, 
        error: null,
      }));

      // Förbered bokningsdata för API
      const apiData = getBookingForAPI();
      
      console.log('Submitting booking:', apiData);

      // Skicka bokningen till API:et
      const response = await bookingService.createBooking(apiData);
      
      console.log('Booking response:', response);

      // Sätt framgångsrik status
      setConfirmationState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        error: null,
        confirmationNumber: response.id || 'BK' + Date.now(),
      }));

    } catch (error) {
      console.error('Failed to submit booking:', error);
      hasSubmittedRef.current = false; // Återställ vid fel så användare kan försöka igen
      setConfirmationState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: false,
        error: error.message || 'Ett fel uppstod vid bokningen',
        confirmationNumber: null,
      }));
    }
  };

  // Formatera datum och tid för visning
  const formatDateTime = () => {
    const date = new Date(bookingData.date);
    const weekday = date.toLocaleDateString('sv-SE', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      date: formattedDate,
      time: bookingData.time,
      endTime: `${parseInt(bookingData.time.split(':')[0]) + 2}:${bookingData.time.split(':')[1]}`
    };
  };

  const dateTime = formatDateTime();

  // Funktion för att starta ny bokning
  const handleNewBooking = () => {
    resetBooking();
  };

  // Skickar bokning - visa loading
  if (confirmationState.isSubmitting) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Slutför din bokning...
          </h3>
          <p className="text-gray-600">
            Vänligen vänta medan vi bekräftar din bokning
          </p>
        </div>
      </div>
    );
  }

  // Fel vid bokning
  if (confirmationState.error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Bokningen misslyckades
          </h3>
          <p className="text-gray-600 mb-4">
            {confirmationState.error}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              Försök igen eller kontakta restaurangen direkt på telefon: 
              <a href="tel:0701234567" className="font-semibold"> 070-123 45 67</a>
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => {
                hasSubmittedRef.current = false; // Återställ ref innan nytt försök
                submitBooking();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Försök igen
            </button>
            <button
              onClick={handleNewBooking}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Börja om
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Framgångsrik bokning
  if (confirmationState.isSuccess) {
    return (
      <div className="space-y-6">
        {/* Success header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bokningen bekräftad!
          </h2>
          <p className="text-gray-600">
            Din bokning har registrerats och en bekräftelse har skickats till din email.
          </p>
        </div>

        {/* Bokningsnummer */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-700 mb-2">Bokningsnummer</p>
          <p className="text-3xl font-bold text-blue-900">
            #{confirmationState.confirmationNumber}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Spara detta nummer för eventuella ändringar
          </p>
        </div>

        {/* Bokningsdetaljer */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bokningsdetaljer</h3>
          
          <div className="space-y-4">
            {/* Datum och tid */}
            <div className="flex items-start">
              <span className="text-2xl mr-3">📅</span>
              <div>
                <p className="font-medium text-gray-900">{dateTime.weekday}</p>
                <p className="text-gray-600">{dateTime.date}</p>
                <p className="text-gray-600">Kl {dateTime.time} - {dateTime.endTime}</p>
              </div>
            </div>

            {/* Antal personer och bord */}
            <div className="flex items-start">
              <span className="text-2xl mr-3">🪑</span>
              <div>
                <p className="font-medium text-gray-900">
                  Bord {bookingData.selectedTable?.tableNumber}
                </p>
                <p className="text-gray-600">
                  {bookingData.numberOfGuests} {bookingData.numberOfGuests === 1 ? 'person' : 'personer'}
                </p>
              </div>
            </div>

            {/* Kontaktuppgifter */}
            <div className="flex items-start">
              <span className="text-2xl mr-3">👤</span>
              <div>
                <p className="font-medium text-gray-900">{bookingData.customerName}</p>
                <p className="text-gray-600">{bookingData.email}</p>
                <p className="text-gray-600">{bookingData.phoneNumber}</p>
              </div>
            </div>

            {/* Specialönskemål om det finns */}
            {bookingData.specialRequests && (
              <div className="flex items-start">
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <p className="font-medium text-gray-900">Specialönskemål</p>
                  <p className="text-gray-600">{bookingData.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Viktig information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">Kom ihåg:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Bokningen gäller i 2 timmar från angiven tid</li>
            <li>• Vid förseningar över 15 minuter kan bordet frigöras</li>
            <li>• Avbokning kan göras fram till 2 timmar innan</li>
            <li>• För ändringar, kontakta oss på 070-123 45 67</li>
          </ul>
        </div>

        {/* Åtgärdsknappar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🖨️</span>
            Skriv ut bekräftelse
          </button>
          
          <button
            onClick={handleNewBooking}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gör en ny bokning
          </button>
        </div>

        {/* Email-notis */}
        <div className="text-center text-sm text-gray-600">
          <p>
            En bekräftelse har skickats till <strong>{bookingData.email}</strong>
          </p>
          <p className="mt-1">
            Kolla gärna din skräppost om du inte ser mailet inom några minuter.
          </p>
        </div>
      </div>
    );
  }

  // Fallback - ska inte komma hit normalt
  return null;
};

export default BookingConfirmation;