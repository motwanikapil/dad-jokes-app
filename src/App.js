import logo from './logo.svg'
import './App.css'
import JokeList from './JokeList'

function App() {
  return (
    <div className='App'>
      <JokeList numJokesToGet={10} />
    </div>
  )
}

export default App
