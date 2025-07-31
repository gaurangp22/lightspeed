import './App.css'
import { BackgroundBeamsDemo } from './BackgroundBeams'


function App() {
  return (
    <div className="h-screen w-full bg-[#111111] font-anton flex flex-col overflow-hidden">
      <div className="flex-1">
        <BackgroundBeamsDemo />
      </div>
      <footer className="text-center text-gray-500 text-sm py-4 z-10 relative">
        Powered by $Lightspeed, all rights reserved
      </footer>
    </div>
  )
}

export default App
