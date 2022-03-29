import './App.css';
import React from 'react';
import { Spinner } from 'react-bootstrap';

// import BackendInterface from './controllers/BackendInterface';
import TradingView from './components/TradingView';
import LatestPredictions from './components/LatestPredictions';
import ConfusionMatrix from './components/ConfusionMatrix';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            predictions: [1, 0, -1, 0, -1, 0, 1],
            groundTruths: [1, 1, 0, 0, -1, 0, 0],
            currentPrediction: 0,
            accuracy: "67,2%",
            confusionMatrix: [[0.4, 0.5, 0.1], [0.05, 0.9, 0.05], [0.05, 0.4, 0.55]]
        }
    }

    componentDidMount() {
        // const bi = new BackendInterface("http://unexpected42.de");
    }


    render() {
        return (
            <div className="container App">
                <h1 className='display-4'>up-neutral-down 5m</h1>
                <h2 className='lead' style={{fontSize: "30px"}}>BTC price prediction</h2>
                <p>Current Accuracy: <strong>{this.state.accuracy}</strong></p>
                <br/>
                <div>
                <h2 className='lead' style={{float: "left"}}>Latest Predictions</h2>
                <h2 className='lead' style={{float: "right"}}>Upcoming</h2>
                </div>
                <div>
                    {this.state.predictions ? (
                        <LatestPredictions 
                            predictions={this.state.predictions} 
                            groundTruths={this.state.groundTruths} 
                            currentPrediction={this.state.currentPrediction}
                        />
                    ): (
                        <div style={{
                            height: "164px", 
                            width: "100%", 
                            display: "flex", 
                            justifyContent: "center",
                            alignItems: "center"
                            }}>
                            <Spinner animation="border"/>
                        </div>
                    )}
                </div>
                <br/>
                <div style={{display: "flex"}}>
                    <div style={{width: "60%"}}>
                        <h2 className='lead'>Current BTC Chart</h2>
                        <TradingView/>
                    </div>
                    <div style={{width: "5%"}}/>
                    <div style={{width: "35%"}}>
                        <h2 className='lead' style={{marginLeft: "24px"}}>Confusion Matrix</h2>
                        <ConfusionMatrix confusionMatrix={this.state.confusionMatrix}/>
                    </div>
                </div>
            </div>
        );
    } // end of render



} // end of class App
export default App;