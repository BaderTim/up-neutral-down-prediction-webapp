import TradingViewWidget from "react-tradingview-widget";
import React from 'react';

export default function TradingView(props) {

    const convertInterval = (interval) => {
        switch (interval) {
            case '1m':
                return '1';
            case '5m':
                return '5';
            case '15m':
                return '15';
            case '30m':
                return '30';
            case '1h':
                return '60';
            case '4h':
                return '240';
            case '1d':
                return 'D';
            case '1w':
                return 'W';
            default:
                return '5';
        }
    }

    return ( 
        <TradingViewWidget 
            symbol = {`BINANCE:${props.symbol}${props.spot ? '' : 'PERP'}`}
            theme = {props.mode.dark ? "Dark" : "Light"}
            locale = "de_DE"
            timezone = "Etc/UTC"
            hide_top_toolbar = { true }
            interval = {convertInterval(props.interval)}
            autosize = { true }

        />
    )
}