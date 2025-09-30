// src/services/bookingService.js

const API_BASE_URL = 'https://localhost:7135/api';

class BookingService {
  // Hämta lediga bord för ett specifikt datum, tid och antal gäster
  async getAvailableTables(date, time, numberOfGuests) {
    try {
      // Skapa DateTime-objekt för att bygga korrekt ISO-string
      const bookingDateTime = new Date(`${date}T${time}:00.000Z`);
      
      // Bygg URL med rätt query parameters som matchar ditt API
      const url = `${API_BASE_URL}/booking/available-tables?BookingDateTime=${bookingDateTime.toISOString()}&NumberOfGuests=${numberOfGuests}`;
      
      console.log('Fetching available tables from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Available tables response:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching available tables:', error);
      
      // Förbättrad felhantering med mer specifika meddelanden
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Kunde inte ansluta till servern. Kontrollera att API:et körs på http://localhost:5062');
      }
      
      throw new Error(`Kunde inte hämta lediga bord: ${error.message}`);
    }
  }

  // Skapa en ny bokning
  async createBooking(bookingData) {
    try {
      const url = `${API_BASE_URL}/booking`;
      
      console.log('Creating booking with data:', bookingData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const result = await response.json();
      console.log('Booking created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Kunde inte skapa bokning. Försök igen.');
    }
  }

  // Test-funktion för att kontrollera API-anslutning
  async testConnection() {
    try {
      const testDate = new Date('2024-12-15T12:00:00.000Z').toISOString();
      const response = await fetch(`${API_BASE_URL}/booking/available-tables?BookingDateTime=${testDate}&NumberOfGuests=2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Connection test response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Exportera en instans av servicen
export default new BookingService();