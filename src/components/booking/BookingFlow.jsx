import React from 'react';
import { useBookingContext } from '../../context/BookingContext';
import SelectDateTime from './SelectDateTime';
import SelectTable from './SelectTable';
import CustomerDetails from './CustomerDetails';
import BookingConfirmation from './BookingConfirmation';

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
        return <CustomerDetails />;
      case 4:
        return <BookingConfirmation />;
      default:
        return <SelectDateTime />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar - visa inte på bekräftelsesidan om bokning är klar */}
      {bookingData.currentStep < 4 && (
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
      )}

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}
      </div>

    </div>
  );
};

export default BookingFlow;