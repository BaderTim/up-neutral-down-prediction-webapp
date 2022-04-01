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


    async getAPIs() {
        const url = this.domain + ":" + this.port;
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {paths: ["error "]};
                }
        });
    } // end of getAPIs


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


    async getAccuracy(wantedHistory=0) {
        const url = this.domain + ":" + this.port + this.api + "/accuracy?history=" + wantedHistory;
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {accuracy: "error", history: "error"};
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


    async getPredictionsAndGroundTruths(wantedHistory=0) {
        const url = this.domain + ":" + this.port + this.api + "/predictionsAndGroundTruths?history=" + wantedHistory;
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


    async getConfusionMatrix(wantedHistory=0) {
        const url = this.domain + ":" + this.port + this.api + "/confusionMatrix?history=" + wantedHistory;
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


    async getProfit(wantedHistory=0) {
        const url = this.domain + ":" + this.port + this.api + "/profit?history=" + wantedHistory;
        return fetch(url, this.options)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    console.log(response);
                    return {profit: "error", history: "error"};
                }
        });
    } // end of getProfit


}