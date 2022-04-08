import React from 'react';
import SinglePrediction from './SinglePrediction';

export default function LatestPredictions(props) {

    const {predictions, groundTruths, currentPrediction, minutes, nextPredictionInMS} = props;

    const getTimeString = (timestamp) => {
        return `${('0' + new Date(timestamp).getHours()).slice(-2)}:${('0' + new Date(timestamp).getMinutes()).slice(-2)}`;
    }

    const getTimeLeftString = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (60 * 1000)) % 60);
        const hours = Math.floor((milliseconds / (60 * 60 * 1000)) % 24);
        const days = Math.floor((milliseconds / (60 * 60 * 1000 * 24)));
        if(days > 0) {
            return `in ${('0' + days).slice(-2)}:${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        }
        if(hours > 0) {
            return `in ${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        }
        return `in ${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
    }

    const latestStep = Date.now() - (Date.now() % (60 * minutes * 1000));

    if(predictions.length === 0) {
        return <div className="display-6" style={{height: "164px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "red"}}><strong>Error</strong></div>
    }

    return (
        <div style={{display: "flex"}}>
            
            {predictions.map((prediction, index) => {
                let currentStep = latestStep - (60 * minutes * (predictions.length - index - 1) * 1000);
                return <SinglePrediction 
                            key={index}
                            prediction={prediction} 
                            groundTruth={groundTruths[index]} 
                            time={getTimeString(currentStep)}
                            mode={props.mode}
                        />
            })}

            <div style={{width: "18rem"}}></div>

            <SinglePrediction 
                prediction={currentPrediction} 
                groundTruth={currentPrediction} 
                time={getTimeLeftString(nextPredictionInMS)} 
                mode={props.mode}
            />
        </div>
    );
            
}
