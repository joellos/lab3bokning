// src/components/booking/BookingFlow.jsx

import React from 'react';
import { useBookingContext } from '../../context/BookingContext';
import SelectDateTime from './SelectDateTime';
import SelectTable from './SelectTable';

const BookingFlow = () => {
  const { bookingData } = useBookingContext();

  // Progress bar data
  const steps = [
    { number: 1, title: 'Datum & Tid', completed: bookingData.currentStep > 1 },
    { number: 2, title: 'Välj Bord', completed: bookingData.currentStep > 2 },
    { number: 3, title: 'Kontaktinfo', completed: bookingData.currentStep > 3 },
    { number: 4, title: 'Bekräftelse', completed: bookingData.currentStep > 4 },
  ];

  const renderStep = () => {
    switch (bookingData.currentStep) {
      case 1:
        return <SelectDateTime />;
      case 2:
        return <SelectTable />;
      case 3:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kontaktuppgifter
            </h2>
            <p className="text-gray-600">
              CustomerDetails-komponenten kommer här...
            </p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bekräftelse
            </h2>
            <p className="text-gray-600">
              BookingConfirmation-komponenten kommer här...
            </p>
          </div>
        );
      default:
        return <SelectDateTime />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${bookingData.currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : step.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-700'
                    }
                  `}
                >
                  {step.completed ? '✓' : step.number}
                </div>
                <span
                  className={`
                    mt-2 text-sm font-medium
                    ${bookingData.currentStep === step.number
                      ? 'text-blue-600'
                      : step.completed
                      ? 'text-green-600'
                      : 'text-gray-500'
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-4
                    ${step.completed ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}
      </div>

      {/* Loading overlay */}
      {bookingData.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Behandlar din bokning...</p>
          </div>
        </div>
      )}

      {/* Error notification */}
      {bookingData.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
          <div className="flex items-center">
            <span className="text-xl mr-2">❌</span>
            <div>
              <p className="font-semibold">Fel</p>
              <p className="text-sm">{bookingData.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug information (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700">Bokningsdata:</h4>
              <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded overflow-auto">
                {JSON.stringify({
                  currentStep: bookingData.currentStep,
                  date: bookingData.date,
                  time: bookingData.time,
                  numberOfGuests: bookingData.numberOfGuests,
                  selectedTable: bookingData.selectedTable ? {
                    id: bookingData.selectedTable.id,
                    tableNumber: bookingData.selectedTable.tableNumber,
                    capacity: bookingData.selectedTable.capacity
                  } : null
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Status:</h4>
              <div className="mt-1 space-y-1">
                <div className={`text-xs px-2 py-1 rounded ${bookingData.isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                  Loading: {bookingData.isLoading ? 'Yes' : 'No'}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${bookingData.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                  Error: {bookingData.error || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;