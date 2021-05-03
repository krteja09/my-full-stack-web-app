import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import * as Constants from './constants';

function App() {

  const [isAppRunning, setIsAppRunning] = useState(false)
  const [stopId, setStopId] = useState(1);
  const [invalidMessage, setInvalidMessage] = useState();
  const [state, setState] = useState({route1arrival1: 0,
    route1arrival2: 0,
    route2arrival1: 0,
    route2arrival2: 0,
    route3arrival1: 0,
    route3arrival2: 0
  })

  const previousTrip = (estimatedtime) => {

    if (estimatedtime > Constants.NEXTBUSSERVICE ) {
      return estimatedtime - Constants.NEXTBUSSERVICE;
    } else if (estimatedtime === 0) {
      return Constants.NEXTBUSSERVICE;
    }
    return estimatedtime;
  };
  const handlePlayClick = () => {
    if(stopId >= 1 && stopId <= Constants.NUMBEROFSTOPS ){
      setIsAppRunning(true);
      updateState();
      setInterval(() => updateState(), (60* 1000));
    } else{
      setInvalidMessage("Invalid Stop ID.Please Enter Valid Stop ID.");
    }
  };

  const handlePauseClick = () => {
    setIsAppRunning(false);
    setInvalidMessage();
    clearInterval();
  };

  const updateState = () => {
    axios.get(Constants.URL + stopId)
        .then(res => {
          console.log(res);
          let route1arrival1 = res.data.UpdatedTimes[0].arrivals.first_arrival_time;
          let route1arrival2 = res.data.UpdatedTimes[0].arrivals.second_arrival_time;
          let route2arrival1 = res.data.UpdatedTimes[1].arrivals.first_arrival_time;
          let route2arrival2 = res.data.UpdatedTimes[1].arrivals.second_arrival_time;
          let route3arrival1 = res.data.UpdatedTimes[2].arrivals.first_arrival_time;
          let route3arrival2 = res.data.UpdatedTimes[2].arrivals.second_arrival_time;
          setState({ route1arrival1, route1arrival2, route2arrival1, route2arrival2, route3arrival1, route3arrival2 });
        })
        .catch(
            function (error){
              setIsAppRunning(false);
              setInvalidMessage("Internal Server Error.")
              console.log(error);
            });
  }
  return (
      <div className="App">
        { isAppRunning ?
            <div>
              <p>
                <h3> Stop { stopId }: </h3>
                Route 1 in { state.route1arrival1 } mins and { state.route1arrival2 } mins.
                Route 2 in { state.route2arrival1 } mins and { state.route2arrival2 } mins.
                Route 3 in { state.route3arrival1 } mins and { state.route3arrival2 } mins.
              </p>
              <p>
                <h3> Stop { parseInt(stopId) + 1 }: </h3>
                Route 1 in { previousTrip( state.route1arrival1 + Constants.TIMEBETWEENSTOPS) } mins and { previousTrip(state.route1arrival1 + Constants.TIMEBETWEENSTOPS ) + Constants.NEXTBUSSERVICE  } mins.
                Route 2 in { previousTrip( state.route2arrival1 + Constants.TIMEBETWEENSTOPS) } mins and { previousTrip(state.route2arrival1 + Constants.TIMEBETWEENSTOPS ) + Constants.NEXTBUSSERVICE  } mins.
                Route 3 in { previousTrip( state.route3arrival1 + Constants.TIMEBETWEENSTOPS) } mins and { previousTrip(state.route3arrival1 + Constants.TIMEBETWEENSTOPS ) + Constants.NEXTBUSSERVICE  } mins.
              </p>
              <button
                  onClick={handlePauseClick}
                  className="btn btn-danger d-flex justify-content-center"
                  style={{margin: "auto", backgroundColor: "red"}}
              >Stop
              </button>
            </div> :
            <div>
              <h4 className="d-flex justify-content-center" style={{color: "red"}}>{invalidMessage}</h4>
              <label>Stop ID: </label>
              <input
                  value={stopId}
                  name="StopId"
                  type="text"
                  placeholder="Stop Id"
                  className="d-flex justify-content-center"
                  style={{margin: "30px"}} onChange={(e) => setStopId(e.target.value)} />
              <br />

              <button
                  onClick={handlePlayClick}
                  className="btn btn-primary d-flex justify-content-center"
                  style={{margin: "auto", backgroundColor: "#3490dc"}}
              > Start
              </button>
            </div>
        }
      </div>
  );
}

export default App;