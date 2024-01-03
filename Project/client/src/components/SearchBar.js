import React from "react";

class SearchBar extends React.Component {
  //fetch all the sightings as soon as the page loads
  async componentDidMount() {
    await this.fetchSightings();
  }

  // submit the value the user passes to the search bar
  handleSubmit = async (evt) => {
    evt.preventDefault();
    const query = document.querySelector("#search").value.trim();

    this.props.updateState(query, true, false, []);

    // if the user passed a value to the search bar, use it as the query parameter
    if (query.length > 0) {
      this.fetchSightings(query);
    } else {
      this.fetchSightings();
    }
  };

  async fetchSightings(query) {
    // basic url without any parameters (backend returns all sightings)
    let url = "https://jk911.brighton.domains/pangolin_api?search=";

    // add a parameter to the url to only fetch relevant sightings
    if (query) {
      url += encodeURIComponent(query);
    }

    // use the url to try and fetch the sightings
    try {
      const result = await fetch(url, { method: "GET" });
      const jsonData = await result.json();
      this.props.updateState(query, false, true, jsonData.sightings);
    } catch (err) {
      this.props.updateState(query, false, true, []);
    }
  }

  render = () => {
    return (
      <form id="searchBar" onSubmit={this.handleSubmit}>
        <label className="searchLabel" htmlFor="search"></label>
        <input
          className="search"
          id="search"
          type="search"
          placeholder="Search Pangolin Sightings..."
        />
        <button className="searchButton" type="submit">
          Go
        </button>
      </form>
    );
  };
}

export default SearchBar;
