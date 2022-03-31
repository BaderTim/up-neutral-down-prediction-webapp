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
            history: 0,
            confusionMatrix: null,
            UIloopID: null,
            dataFetcherRunning: false,
            nextPredictionInMS: 0
        }
    } // end of constructor


    async dataFetcher(bi, minutes) {
        while(this.state.dataFetcherRunning) {
            console.log("Updating predictions...");
            bi.getAccuracy().then(accuracy => {
                this.setState({
                    accuracy: accuracy.accuracy,
                    history: accuracy.history
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
                    predictions: preds.slice(0, 8).reverse(),
                    groundTruths: gts.slice(0, 8).reverse()
                });
            });
            bi.getConfusionMatrix().then(confusionMatrix => {
                this.setState({
                    confusionMatrix: confusionMatrix.confusionMatrix
                });
            });
            const timeLeftUntilNextPredictionMS = (60 * minutes * 1000) - new Date() % (60 * minutes * 1000) + 10000
            this.setState({nextPredictionInMS: timeLeftUntilNextPredictionMS});
            await new Promise(r => setTimeout(r, timeLeftUntilNextPredictionMS)); // sleep
        }
    }


    async componentDidMount() {
        const bi = new BackendInterface("https://unexpected42.de", "1337", "/v4_1");
        //const bi = new BackendInterface("http://localhost", "1337", "/v4_1");
        await bi.getModel().then(model => {
            this.setState({model: model});
        });
        const minutes = this.getIntervalInMinutes(this.state.model.interval);
        // start data fetcher
        if(!this.state.dataFetcherRunning) {
            this.setState({
                dataFetcherRunning: true
            });
            this.dataFetcher(bi, minutes);
        }
        // start UI loop
        if(this.state.UIloopID === null) {
            this.setState({
                UIloopID: setInterval(() => {
                    this.setState({
                        nextPredictionInMS: this.state.nextPredictionInMS-1000
                    })
                }, 1000) // update every 1 second
            });
        }
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
                <p>Model '<strong>{this.state.model.name}</strong>' | Price Difference: <strong>{this.state.model.priceDifference}%</strong> | Current Accuracy: <strong>{Math.round(this.state.accuracy * 100, 2)}%</strong> <span style={{color: "grey"}}>(latest {this.state.history} predictions)</span></p>
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
                            minutes={this.getIntervalInMinutes(this.state.model.interval)}
                            nextPredictionInMS={this.state.nextPredictionInMS}
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
                            <ConfusionMatrix 
                                confusionMatrix={this.state.confusionMatrix}
                                history={this.state.history}
                            />
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


    getIntervalInMinutes = (interval) => {
        /**
         * Reduces a sequence of names to initials.
         * @param  {string} interval - 1m 3m 5m 15m 30m 1h 2h 4h 6h 8h 12h 1d 3d 1w 1M
         * @return {number} - minutes
         */
        if (interval.includes('m')) {
            return parseInt(interval.replace('m', ''));
        }
        if (interval.includes('h')) {
            return parseInt(interval.replace('h', '')) * 60;
        }
        if (interval.includes('d')) {
            return parseInt(interval.replace('d', '')) * 1440;
        }
        if (interval.includes('w')) {
            return parseInt(interval.replace('w', '')) * 10080;
        }
        if (interval.includes('M')) {
            return parseInt(interval.replace('M', '')) * 43200;
        }
        return 5; // default
    }


} // end of class App
export default App;