// src/context/BookingContext.jsx

import React, { createContext, useContext, useReducer } from 'react';

// Initial state för bokningsflödet
const initialState = {
  // Steg 1: Datum och tid
  date: '',
  time: '',
  numberOfGuests: 2,
  
  // Steg 2: Bordval
  selectedTable: null,
  
  // Steg 3: Kontaktinfo
  customerName: '',
  phoneNumber: '',
  email: '',
  
  // Steg 4: Bekräftelse (kommer senare)
  bookingConfirmation: null,
  
  // Flow control
  currentStep: 1,
  isLoading: false,
  error: null,
};

// Action types
const BOOKING_ACTIONS = {
  UPDATE_BOOKING_DATA: 'UPDATE_BOOKING_DATA',
  NEXT_STEP: 'NEXT_STEP',
  PREVIOUS_STEP: 'PREVIOUS_STEP',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_BOOKING: 'RESET_BOOKING',
};

// Reducer för att hantera state changes
const bookingReducer = (state, action) => {
  switch (action.type) {
    case BOOKING_ACTIONS.UPDATE_BOOKING_DATA:
      return {
        ...state,
        ...action.payload,
        error: null, // Clear error när data uppdateras
      };
      
    case BOOKING_ACTIONS.NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 4),
        error: null,
      };
      
    case BOOKING_ACTIONS.PREVIOUS_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        error: null,
      };
      
    case BOOKING_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case BOOKING_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      
    case BOOKING_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    case BOOKING_ACTIONS.RESET_BOOKING:
      return initialState;
      
    default:
      return state;
  }
};

// Create context
const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
  const [bookingData, dispatch] = useReducer(bookingReducer, initialState);

  // Action creators
  const updateBookingData = (data) => {
    dispatch({ type: BOOKING_ACTIONS.UPDATE_BOOKING_DATA, payload: data });
  };

  const nextStep = () => {
    dispatch({ type: BOOKING_ACTIONS.NEXT_STEP });
  };

  const prevStep = () => {
    dispatch({ type: BOOKING_ACTIONS.PREVIOUS_STEP });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_ERROR });
  };

  const resetBooking = () => {
    dispatch({ type: BOOKING_ACTIONS.RESET_BOOKING });
  };

  // Validation functions
  const isStep1Valid = () => {
    return bookingData.date && 
           bookingData.time && 
           bookingData.numberOfGuests >= 1 && 
           bookingData.numberOfGuests <= 20;
  };

  const isStep2Valid = () => {
    return bookingData.selectedTable !== null;
  };

  const isStep3Valid = () => {
    return bookingData.customerName.trim() &&
           bookingData.phoneNumber.trim() &&
           bookingData.email.trim() &&
           bookingData.email.includes('@');
  };

  // Helper function för att få aktuell steg-validering
  const isCurrentStepValid = () => {
    switch (bookingData.currentStep) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      case 4: return true; // Bekräftelsesida
      default: return false;
    }
  };

  // Helper för att bygga fullständigt DateTime för API-anrop
  const getBookingDateTime = () => {
    if (bookingData.date && bookingData.time) {
      return new Date(`${bookingData.date}T${bookingData.time}`);
    }
    return null;
  };

  // Helper för att formatera bokningsdata för API
  const getBookingForAPI = () => {
    return {
      tableId: bookingData.selectedTable?.id,
      bookingDateTime: getBookingDateTime(),
      numberOfGuests: bookingData.numberOfGuests,
      customerName: bookingData.customerName.trim(),
      phoneNumber: bookingData.phoneNumber.trim(),
      email: bookingData.email.trim(),
      specialRequests: '', // Kommer senare om vi lägger till detta
    };
  };

  // Context value
  const contextValue = {
    bookingData,
    
    // Actions
    updateBookingData,
    nextStep,
    prevStep,
    setLoading,
    setError,
    clearError,
    resetBooking,
    
    // Validation helpers
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isCurrentStepValid,
    
    // Data helpers
    getBookingDateTime,
    getBookingForAPI,
    
    // Constants
    BOOKING_ACTIONS,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook för att använda context
export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;