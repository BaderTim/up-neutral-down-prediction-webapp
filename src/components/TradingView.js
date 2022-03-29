import TradingViewWidget from "react-tradingview-widget";
import React from 'react';

export default function TradingView() {

    return ( 
        <TradingViewWidget 
            symbol = "BINANCE:BTCUSDT"
            theme = "Light"
            locale = "de_DE"
            timezone = "Etc/UTC"
            hide_top_toolbar = { true }
            interval = "5"
            autosize = { true }
        />
    )
}