import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const CancelToken = axios.CancelToken;
let source = CancelToken.source();

export class AuthMovieHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieInput: "",
      movieArray: [],
      isLoading: false,
      isError: false,
      errorMessage: "",
    };
  }
  async componentDidMount() {
    let randomTitle = ["batman", "superman", "lego", "alien", "predator"];
    let randomSelectedTitle = Math.floor(Math.random() * randomTitle.length);
    this.setState({
      isLoading: true,
    });
    try {
      let movieData = await axios.get(
        `http://omdbapi.com/?apikey=489ed649&s=${randomTitle[randomSelectedTitle]}`, {cancelToken: source.token,}
      );
      this.setState({
        movieArray: movieData.data.Search,
        isLoading: false,
        movieInput: "",
      });
    } catch (e) {}
  }
  componentWillUnmount() {
    // if (source) {
    //   source.cancel("Operation canceled by the user.");
    // }
    if (this.state.isLoading) {
      source.cancel("Operation canceled by the user.");
    }
  }
  handleMovieInput = (event) => {
    this.setState({
      movieInput: event.target.value,
      isError: false,
      errorMessage: "",
    });
  };
  handleSearchMovieClick = async (event) => {
    if (this.state.movieInput.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Sorry, please enter a movie title",
        movieInput: "",
      });
      return;
    }
    this.setState({
      isLoading: true,
    });
    try {
      let movieData = await axios.get(
        `http://omdbapi.com/?apikey=489ed649&s=${this.state.movieInput}`
      );
      console.log(movieData);
      if (movieData.data?.Response === "False") {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage:
            "Sorry, No such movie exists. Please search another one",
        });
        return;
      }
      this.setState({
        movieArray: movieData.data.Search,
        isLoading: false,
        movieInput: "",
      });
    } catch (e) {}
  };
  handleSearchOnEnter = async (event) => {
    if (this.state.movieInput.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Sorry, please enter a movie title",
      });
      return;
    }
    if (event.key === "Enter") {
      this.setState({
        isLoading: true,
      });
      try {
        let movieData = await axios.get(
          `http://omdbapi.com/?apikey=489ed649&s=${this.state.movieInput}`
        );
        if (movieData.data?.Response === "False") {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage:
              "Sorry, No such movie exists. Please search another one",
          });
          return;
        }
        this.setState({
          movieArray: movieData.data.Search,
          isLoading: false,
          movieInput: "",
        });
      } catch (e) {}
    }
  };
  showMovieArrayList = () => {
    return this.state.movieArray.map((item) => {
      return (
        <div className="col-sm-4" key={item.imdbID}>
          <div className="card">
            <div>
              <img
                className="card-img-top"
                src={item.Poster}
                alt={item.Title}
                style={{ width: 250, height: 250 }}
              />
            </div>
            <Link to={{pathname: `/movie-detail/${item.Title}`,}}>
                <h5 className="card-title">{item.Title}</h5>
            </Link>
          </div>
        </div>
      );
    });
  };
  render() {
    return (
      <div style={{ marginTop: 50, textAlign: "center" }}>
        <input
          style={{ width: 450 }}
          name="movieInput"
          value={this.state.movieInput}
          onChange={this.handleMovieInput}
          onKeyPress={this.handleSearchOnEnter}
        />
        <br />
        <button
          onClick={this.handleSearchMovieClick}
          style={{ margin: "25px 25px" }}
        >
          Search
        </button>
        <div>
          {this.state.isError && (
            <span style={{ color: "red" }}>{this.state.errorMessage}</span>
          )}
        </div>
        {this.state.isLoading ? (
          <div>...Loading</div>
        ) : (
          <div className="row">{this.showMovieArrayList()}</div>
        )}
      </div>
    );
  }
}
export default AuthMovieHome;
