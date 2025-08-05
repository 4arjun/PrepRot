import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentGreeting, setCurrentGreeting] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const greetings = [
    { text: "Hello", language: "English" },
    { text: "Hola", language: "Spanish" },
    { text: "Bonjour", language: "French" },
    { text: "नमस्ते", language: "Hindi" },
    { text: "こんにちは", language: "Japanese" },
    { text: "안녕하세요", language: "Korean" },
    { text: "مرحبا", language: "Arabic" },
    { text: "Ciao", language: "Italian" },
    { text: "Hallo", language: "German" },
    { text: "Olá", language: "Portuguese" },
    { text: "Привет", language: "Russian" },
    { text: "你好", language: "Chinese" },
    { text: "Merhaba", language: "Turkish" },
    { text: "Hej", language: "Swedish" },
    { text: "Hei", language: "Norwegian" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentGreeting((prev) => (prev + 1) % greetings.length)
        setIsVisible(true)
      }, 500)
    }, 3000)

    setIsVisible(true)

    return () => clearInterval(interval)
  }, [greetings.length])

  const currentGreetingData = greetings[currentGreeting]

  return (
    <div className="welcome-container">
      <div className="background-gradient"></div>
            <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--delay': `${Math.random() * 3}s`,
              '--duration': `${4 + Math.random() * 4}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}
          ></div>
        ))}
      </div>

      <div className={`greeting-container ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="greeting-text">
          {currentGreetingData.text}
        </div>
       
      </div>

      <div className="welcome-message">
        Welcome to the world
      </div>

      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>
    </div>
  )
}

export default App
