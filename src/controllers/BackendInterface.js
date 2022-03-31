export default class BackendInterface {

    domain;
    api;
    port;

    options = {
        method: "GET",
        headers: {
            "Accept": "application/json"
          }
    }

    constructor(domain, port, api) {
        this.domain = domain;
        this.port = port
        this.api = api;
    }


    async getModel() {
        const url = this.domain + ":" + this.port + this.api + "/model";
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {name: "error", priceDifference: "error", interval: "error", symbol: "error"};
                }
        });
    } // end of getModel


    async getAccuracy() {
        const url = this.domain + ":" + this.port + this.api + "/accuracy";
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {accuracy: "error"};
                }
        });
    } // end of getAccuracy


    async getCurrentPrediction() {
        const url = this.domain + ":" + this.port + this.api + "/currentPrediction";
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {prediction: "error"};
                }
        });
    } // end of getCurrentPrediction


    async getPredictionsAndGroundTruths() {
        const url = this.domain + ":" + this.port + this.api + "/predictionsAndGroundTruths";
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {predictions: [], groundTruths: []};
                }
        });
    } // end of getPredictionsAndGroundTruths


    async getConfusionMatrix() {
        const url = this.domain + ":" + this.port + this.api + "/confusionMatrix";
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return [];
                }
        });
    } // end of getConfusionMatrix


}