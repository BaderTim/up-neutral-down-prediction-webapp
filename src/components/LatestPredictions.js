import React from 'react';
import SinglePrediction from './SinglePrediction';

export default function LatestPredictions(props) {

    const {predictions, groundTruths, currentPrediction, interval} = props;

    const getTimeString = (timestamp) => {
        return `${('0' + new Date(timestamp).getHours()).slice(-2)}:${('0' + new Date(timestamp).getMinutes()).slice(-2)}`;
    }

    const getIntervalInMinutes = (interval) => {
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
        return 5; // default
    }

    const minutes = getIntervalInMinutes(interval)
    const latestStep = Date.now() - (Date.now() % (60 * minutes * 1000));
    const nextStep = latestStep + (60 * minutes * 1000);

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
