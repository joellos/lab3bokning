// src/components/booking/SelectTable.jsx

import React, { useState, useEffect } from 'react';
import { useBookingContext } from '../../context/BookingContext';
import bookingService from '../../services/bookingService';

const SelectTable = () => {
  const { bookingData, updateBookingData, nextStep, prevStep } = useBookingContext();
  const [availableTables, setAvailableTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Hämta lediga bord när komponenten laddas
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Konstruera datum/tid från separata värden
        const bookingDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
        
        console.log('Fetching tables for:', {
          date: bookingData.date,
          time: bookingData.time,
          guests: bookingData.numberOfGuests,
          fullDateTime: bookingDateTime
        });

        // Anropa API:et med query-parametrar
        const tables = await bookingService.getAvailableTables(
          bookingData.date,
          bookingData.time,
          bookingData.numberOfGuests
        );

        console.log('Available tables:', tables);
        setAvailableTables(tables);

      } catch (err) {
        console.error('Error fetching tables:', err);
        setError(err.message || 'Kunde inte hämta lediga bord');
      } finally {
        setIsLoading(false);
      }
    };

    // Bara hämta om vi har all nödvändig data från föregående steg
    if (bookingData.date && bookingData.time && bookingData.numberOfGuests) {
      fetchAvailableTables();
    } else {
      setError('Saknar bokningsdata. Gå tillbaka till föregående steg.');
      setIsLoading(false);
    }
  }, [bookingData.date, bookingData.time, bookingData.numberOfGuests]);

  const handleTableSelect = (table) => {
    updateBookingData({ selectedTable: table });
    console.log('Selected table:', table);
  };

  const handleNext = () => {
    if (bookingData.selectedTable) {
      nextStep();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Hämtar lediga bord...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Kunde inte hämta lediga bord
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Försök igen
            </button>
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Gå tillbaka
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No tables available
  if (availableTables.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-yellow-500 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inga lediga bord
          </h3>
          <p className="text-gray-600 mb-4">
            Tyvärr finns inga lediga bord för {bookingData.numberOfGuests} personer 
            den {bookingData.date} kl {bookingData.time}.
          </p>
          <div className="space-x-3">
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Välj annan tid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Välj bord
        </h2>
        <p className="text-gray-600">
          Lediga bord för {bookingData.numberOfGuests} personer den {bookingData.date} kl {bookingData.time}
        </p>
      </div>

      {/* Available Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableSelect(table)}
            className={`
              relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200
              ${bookingData.selectedTable?.id === table.id
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {/* Selection indicator */}
            {bookingData.selectedTable?.id === table.id && (
              <div className="absolute top-2 right-2 text-blue-600 text-xl">
                ✓
              </div>
            )}

            {/* Table info */}
            <div className="text-center">
              <div className="text-3xl mb-2">🪑</div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Bord {table.tableNumber}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                Plats för {table.capacity} personer
              </p>

              {/* Table features/benefits */}
              <div className="space-y-1 text-xs text-gray-500">
                {table.capacity >= bookingData.numberOfGuests + 2 && (
                  <div className="text-green-600">✓ Extra utrymme</div>
                )}
                {table.capacity === bookingData.numberOfGuests && (
                  <div className="text-blue-600">✓ Perfekt storlek</div>
                )}
              </div>
            </div>

            {/* Selected state styling */}
            {bookingData.selectedTable?.id === table.id && (
              <div className="mt-3 text-center text-sm font-medium text-blue-600">
                Valt bord
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected table summary */}
      {bookingData.selectedTable && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 text-xl mr-3">✓</div>
            <div>
              <p className="font-semibold text-green-900">
                Bord {bookingData.selectedTable.tableNumber} valt
              </p>
              <p className="text-sm text-green-700">
                Plats för {bookingData.selectedTable.capacity} personer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Tillbaka
        </button>
        
        <button
          onClick={handleNext}
          disabled={!bookingData.selectedTable}
          className={`
            px-6 py-2 rounded-lg transition-colors
            ${bookingData.selectedTable
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Fortsätt →
        </button>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              availableTables: availableTables.length,
              selectedTable: bookingData.selectedTable,
              queryParams: {
                date: bookingData.date,
                time: bookingData.time,
                guests: bookingData.numberOfGuests
              }
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SelectTable;