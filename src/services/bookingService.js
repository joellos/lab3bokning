const API_BASE_URL = 'http://localhost:7135/api';

class BookingService {
  // Hämta lediga bord för ett specifikt datum, tid och antal gäster
  async getAvailableTables(date, time, numberOfGuests) {
    try {
      // Konvertera datum till rätt format (YYYY-MM-DD)
      const formattedDate = date;
      
      // Bygg URL med query parameters
      const url = `${API_BASE_URL}/booking/available-tables?date=${formattedDate}&time=${time}&guests=${numberOfGuests}`;
      
      console.log('Fetching available tables from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Available tables response:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching available tables:', error);
      throw new Error('Kunde inte hämta lediga bord. Kontrollera att servern körs.');
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
      const response = await fetch(`${API_BASE_URL}/booking/available-tables?date=2024-01-01&time=12:00&guests=2`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Exportera en instans av servicen
export default new BookingService();