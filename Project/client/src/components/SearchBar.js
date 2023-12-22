import React from "react";

class SearchBar extends React.Component {
  async componentDidMount() {
    await this.fetchSightings();
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();
    const query = document.querySelector("#search").value.trim();

    this.props.updateState(query, true, false, []);

    if (query.length > 0) {
      this.fetchSightings(query);
    } else {
      this.fetchSightings();
    }
  };

  async fetchSightings(query) {
    let url = "https://jk911.brighton.domains/pangolin_api?search=";

    if (query) {
      url += encodeURIComponent(query);
    }

    try {
      const result = await fetch(url, { method: "GET" });
      const jsonData = await result.json();
      this.props.updateState(query, false, true, jsonData.sightings);
    } catch (err) {
      console.log(err);
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
        <button className="searchButton" type="submit">Go</button>
      </form>
    );
  };
}

export default SearchBar;