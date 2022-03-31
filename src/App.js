import React from 'react';
import { Spinner } from 'react-bootstrap';

import BackendInterface from './controllers/BackendInterface';
import TradingView from './components/TradingView';
import LatestPredictions from './components/LatestPredictions';
import ConfusionMatrix from './components/ConfusionMatrix';


class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            model: {name: "loading", priceDifference: "loading", interval: "...", symbol: "..."},
            predictions: null,
            groundTruths: null,
            currentPrediction: null,
            accuracy: "loading",
            confusionMatrix: null
        }
    } // end of constructor


    async componentDidMount() {
        // const bi = new BackendInterface("https://unexpected42.de", "1337", "/v4_1");
        const bi = new BackendInterface("http://localhost", "1337", "/v4_1");
        await bi.getModel().then(model => {
            this.setState({model: model});
        });
        bi.getAccuracy().then(accuracy => {
            this.setState({
                accuracy: accuracy.accuracy
            });
        });
        bi.getCurrentPrediction().then(currentPrediction => {
            this.setState({
                currentPrediction: currentPrediction.prediction
            });
        });
        bi.getPredictionsAndGroundTruths().then(predictionsAndGroundTruths => {
            let preds = predictionsAndGroundTruths.predictionsAndGroundTruths.map(p => p.prediction);
            let gts = predictionsAndGroundTruths.predictionsAndGroundTruths.map(gt => gt.groundTruth);
            this.setState({
                predictions: preds.slice(0, 8),
                groundTruths: gts.slice(0, 8)
            });
        });
        bi.getConfusionMatrix().then(confusionMatrix => {
            this.setState({
                confusionMatrix: confusionMatrix.confusionMatrix
            });
        });
    } // end of componentDidMount


    render() {

        return (
            <div className="container"
                style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxWidth: "1000px",
                }}
                >
                <h1 className='display-4'>up-neutral-down {this.state.model.interval}</h1>
                <h2 className='lead' style={{fontSize: "30px"}}>{this.state.model.symbol} price prediction</h2>
                <p>Model '<strong>{this.state.model.name}</strong>' | Price Difference: <strong>{this.state.model.priceDifference}%</strong> | Current Accuracy: <strong>{Math.round(this.state.accuracy * 100, 2)}%</strong></p>
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
                            interval={this.state.model.interval}
                        />
                    ): (
                        <div style={{
                            height: "164px", 
                            width: "100%", 
                            display: "flex", 
                            justifyContent: "center",
                            alignItems: "center"
                            }}>
                            <Spinner animation="border" variant="primary"/>
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
                        {this.state.confusionMatrix ? (
                            <ConfusionMatrix confusionMatrix={this.state.confusionMatrix}/>
                        ): (
                            <div style={{
                                height: "190px", 
                                width: "100%", 
                                display: "flex", 
                                justifyContent: "center",
                                alignItems: "center"
                                }}>
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
          
    } // end of render


} // end of class App
export default App;