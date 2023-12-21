import React from "react";
// import "../styles/Home.css";

class Home extends React.Component {
  render = () => {
    return (
      <div>
        <div className="homeTitle">
          <h1>Zap App</h1>
        </div>
        <div className="appDescription">
          <p>
            Pangolin's are the world's most trafficked mammal and are threatened
            solely by human impacts. In addition to tracking and poaching, many
            pangolins in Africa face the risk of being killed on roads and by
            electric fences.
          </p>
          <p>
            This application enables game rangers and local communities across
            Southern Africa to record pangolin sightings and mortalities,
            enabling the research teams to study these threats.
          </p>
          <p>
            Using this application you are able to help preserve this endangered
            species by sharing the location of a sighted pangolin. You can also
            explore the locations of pangolins sighted by other users.
          </p>
        </div>
      </div>
    );
  };
}

export default Home;