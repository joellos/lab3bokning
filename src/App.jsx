import './App.css'
import BookingFlow from './components/booking/BookingFlow'
import { BookingProvider } from './context/BookingContext'

function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Lite av Allt - Boka bord
          </h1>
          <BookingFlow />
        </div>
      </div>
    </BookingProvider>
  )
}

export default App