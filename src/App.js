import React, { Component } from "react";
import Axios from "axios";
import AllResults from "./components/AllResults";

const apiKey = process.env.REACT_APP_API_KEY;

class App extends Component {
  state = {
    searchText: "",
    error: "",
    fetchingData: false,
    searchResults: []
  };

  onTextChange = e => {
    this.setState({
      searchText: e.target.value
    });
  };

  onButtonClick = () => {
    this.setState({
      fetchingData: true
    });
    const { searchText } = this.state;
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/search/index.xml?key=${apiKey}&q=${searchText}`;

    Axios.get(requestUri)
      .then(res => {
        this.parseXMLResponse(res.data);
      })
      .catch(error => {
        this.setState({
          error: error.toString(),
          fetchingData: false
        });
      });
  };

  parseXMLResponse = response => {
    const parser = new DOMParser();
    const XMLResponse = parser.parseFromString(response, "application/xml");
    const parseError = XMLResponse.getElementsByTagName("parsererror");

    if (parseError.length) {
      this.setState({
        error: "There was an error fetching results.",
        fetchingData: false
      });
    } else {
      const XMLresults = new Array(...XMLResponse.getElementsByTagName("work"));
      const searchResults = XMLresults.map(result => this.XMLToJson(result));
      this.setState({ searchResults, fetchingData: false });
    }
  };

  //convert XML document into JSON.
  XMLToJson = XML => {
    const allNodes = new Array(...XML.children);
    const jsonResult = {};
    allNodes.forEach(node => {
      if (node.children.length) {
        jsonResult[node.nodeName] = this.XMLToJson(node);
      } else {
        jsonResult[node.nodeName] = node.innerHTML;
      }
    });
    return jsonResult;
  };

  render() {
    return (
      <div className="container">
        <div className="header clearfix mt-5">
          <h3 className="text-muted">Goodreads Search</h3>
        </div>
        <div className="jumbotron">
          <div className="form-group row">
            <input
              className="mr-1 col-sm-9 form-control"
              type="text"
              placeholder="search by title or author"
              name="searchText"
              onChange={this.onTextChange}
              value={this.state.searchText}
            />
            <button
              className="col-sm-2 btn btn-primary"
              onClick={this.onButtonClick}
            >
              Search
            </button>
          </div>
          {this.state.fetchingData ? (
            <p className="lead text-center">{"loading... "}</p>
          ) : (
            (this.state.error && (
              <p className="text-danger">{this.state.error}</p>
            )) || <AllResults books={this.state.searchResults} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
