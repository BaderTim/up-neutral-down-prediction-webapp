import React from 'react';
import SinglePrediction from './SinglePrediction';

export default function LatestPredictions(props) {

    const {predictions, groundTruths, currentPrediction} = props;

    const getTimeString = (timestamp) => {
        return `${('0' + new Date(timestamp).getHours()).slice(-2)}:${('0' + new Date(timestamp).getMinutes()).slice(-2)}`;
    }

    const latestStep = Date.now() - (Date.now() % (60 * 5 * 1000));
    const nextStep = latestStep + (60 * 5 * 1000);

    if(predictions.length === 0) {
        return <div className="display-6" style={{height: "164px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "red"}}><strong>Error</strong></div>
    }

    return (
        <div style={{display: "flex"}}>
            
            {predictions.map((prediction, index) => {
                let currentStep = latestStep - (60 * 5 * (predictions.length - index - 1) * 1000);
                return <SinglePrediction 
                            key={index}
                            prediction={prediction} 
                            groundTruth={groundTruths[index]} 
                            time={getTimeString(currentStep)}
                        />
            })}

            <div style={{width: "18rem"}}></div>

            <SinglePrediction 
                prediction={currentPrediction} 
                groundTruth={currentPrediction} 
                time={getTimeString(nextStep)} 
            />
        </div>
    );
    
}
