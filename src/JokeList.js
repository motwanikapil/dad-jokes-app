import React, { Component } from 'react'
import axios from 'axios'
import './JokeList.css'
import Joke from './Joke'
import { v4 as uuidv4 } from 'uuid'

export default class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  }
  constructor(props) {
    super(props)
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
      loading: false,
    }
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text))
    this.handleVote = this.handleVote.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes()
  }

  async getJokes() {
    let jokes = []
    while (jokes.length < this.props.numJokesToGet) {
      let response = await axios.get('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
        },
      })
      let newJoke = response.data.joke
      if (!this.seenJokes.has(newJoke))
        jokes.push({ id: uuidv4(), joke: newJoke, votes: 0 })
      else console.log('Found a duplicate', newJoke)
    }
    this.setState(
      (st) => {
        return { loading: false, jokes: [...st.jokes, ...jokes] }
      },
      () =>
        window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    )
  }

  handleVote(id, delta) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    )
  }

  handleClick() {
    this.setState({ loading: true }, this.getJokes)
  }
  render() {
    if (this.state.loading) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin'></i>
          <h1 className='JokeList-title'>Loading...</h1>
        </div>
      )
    }

    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes)

    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img
            src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
            alt='laughing-emoji'
          />
          <button className='JokeList-getmore' onClick={this.handleClick}>
            New Jokes
          </button>
        </div>
        <div className='JokeList-jokes'>
          <ul>
            {jokes.map((j) => {
              return (
                <Joke
                  id={j.id}
                  text={j.joke}
                  votes={j.votes}
                  upvote={() => this.handleVote(j.id, 1)}
                  downvote={() => this.handleVote(j.id, -1)}
                />
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}
