import React from 'react';
import { Spinner, Dropdown, DropdownButton  } from 'react-bootstrap';

import BackendInterface from './controllers/BackendInterface';
import TradingView from './components/TradingView';
import LatestPredictions from './components/LatestPredictions';
import ConfusionMatrix from './components/ConfusionMatrix';


class App extends React.Component {

    constructor(props) {
        super(props);
        const ip = "https://unexpected42.de";// "https://unexpected42.de"; // "http://localhost";
        this.state = {
            ip: ip,
            bi: new BackendInterface(ip, "1337", null),
            apis: [],
            model: {name: "loading", priceDifference: "loading", spot: true, interval: "...", symbol: "..."},
            predictions: null,
            groundTruths: null,
            currentPrediction: null,
            accuracy: "loading",
            history: 0,
            profit: 0,
            wantedHistory: 24,
            confusionMatrix: null,
            UIloopID: null,
            dataFetcherID: null,
            nextPredictionInMS: 0
        }
    } // end of constructor


    async componentDidMount() {
        await this.state.bi.getAPIs().then(apis => {
            this.setState({
                apis: apis.paths,
                bi: new BackendInterface(this.state.ip, "1337", apis.paths[0].slice(0, -1)), 
            });
        });
        await this.state.bi.getModel().then(model => {
            this.setState({model: model});
        });
        // start data fetcher
        if(!this.state.dataFetcherID) {
            this.setState({
                dataFetcherID:  this.dataFetcher()
            });
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
                <h1 className='display-4' style={{display: "flex"}}>up-neutral-down {this.state.model.interval} {this.selectModel()}</h1>
                <h2 className='lead' style={{fontSize: "30px"}}>{this.state.model.symbol} price prediction</h2>
                <p>Model '<strong>{this.state.model.name}</strong>' | Price Difference: <strong>{this.state.model.priceDifference}%</strong> | Current Accuracy: <strong>{Math.round(this.state.accuracy * 100, 2)}%</strong> | Current Profit: <strong>{this.state.profit}$</strong> <span style={{color: "grey"}}>(latest {this.state.history} predictions, {this.changeHistory(`change from '${this.state.wantedHistory}'`)})</span></p>
                <br/>
                <div>
                <h2 className='lead' style={{float: "left"}}>Latest 8 Predictions</h2>
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
                        <TradingView 
                            interval={this.state.model.interval} 
                            symbol={this.state.model.symbol}
                            spot={this.state.model.spot}
                        />
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


    //
    // small complex components
    //

    changeHistory = (childs) => {
        return <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={async () => {
            const res = prompt("How far back do you want the prediction history to be? (in predictions, 'max' = complete history)", this.state.wantedHistory);
            if(res !== null && res !== "" && (!isNaN(Number(res)) || res === "max")) {
                await this.setState({
                    wantedHistory: res
                });
                this.fetchData();
            }
        }}>{childs}</span>
    } // end of changeHistory

    selectModel = () => {
        return (
            <DropdownButton  title={this.state.model.name} style={{marginLeft: "20px"}}>
                {this.state.apis.map((api, key) => {

                    return <Dropdown.Item key={key} onClick={async () => {
                        await this.setState({
                            bi: new BackendInterface(this.state.ip, "1337", api.slice(0, -1)),
                            model: {name: "loading", priceDifference: "loading", interval: "...", symbol: "..."},
                            predictions: null,
                            groundTruths: null,
                            currentPrediction: null,
                            accuracy: "loading",
                            profit: 0,
                            confusionMatrix: null,
                        });
                        await this.state.bi.getModel().then(model => {
                            this.setState({model: model});
                        });
                        clearTimeout(this.state.dataFetcherID);
                        this.setState({
                            dataFetcherID: this.dataFetcher()
                        });
                    }}>{api.slice(1, -1)}</Dropdown.Item>
                })}
            </DropdownButton >
        )
    } // end of selectModel


    //
    // helper functions
    //

    async dataFetcher(startInMS = 0) {
        return setTimeout(() => {
            const minutes = this.getIntervalInMinutes(this.state.model.interval);
            this.fetchData()
            const timeLeftUntilNextPredictionMS = (60 * minutes * 1000) - new Date() % (60 * minutes * 1000) + 20000
            clearTimeout(this.state.dataFetcherID);
            this.setState({
                nextPredictionInMS: timeLeftUntilNextPredictionMS,
                dataFetcherID: this.dataFetcher(timeLeftUntilNextPredictionMS)
            });
        }, startInMS);
    } // end of dataFetcher

    async fetchData() {
        const bi = this.state.bi;
        console.log("Updating predictions...");
        bi.getAccuracy(this.state.wantedHistory).then(accuracy => {
            this.setState({
                accuracy: accuracy.accuracy,
                history: accuracy.history
            });
        });
        bi.getProfit(this.state.wantedHistory).then(profit => {
            this.setState({
                profit: profit.profit,
            });
        });
        bi.getCurrentPrediction().then(currentPrediction => {
            this.setState({
                currentPrediction: currentPrediction.prediction
            });
        });
        bi.getPredictionsAndGroundTruths(8).then(predictionsAndGroundTruths => {
            let preds = predictionsAndGroundTruths.predictionsAndGroundTruths.map(p => p.prediction);
            let gts = predictionsAndGroundTruths.predictionsAndGroundTruths.map(gt => gt.groundTruth);
            this.setState({
                predictions: preds.slice(0, 8).reverse(),
                groundTruths: gts.slice(0, 8).reverse()
            });
        });
        bi.getConfusionMatrix(this.state.wantedHistory).then(confusionMatrix => {
            this.setState({
                confusionMatrix: confusionMatrix.confusionMatrix
            });
        });
    } // end of fetchData

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