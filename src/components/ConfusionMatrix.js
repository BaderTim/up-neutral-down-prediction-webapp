import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

export default function ConfusionMatrix(props) {

    const { confusionMatrix, history } = props;
    const { dark, componentColor} = props.mode;
    const xLabel = ["up", "neutral", "down"]
    const getRGB = (value) => {
        let buffer = 1;
        if(dark) {
            buffer = 0.8;
        }
        const color = (buffer-value/2) * 255;
        return `rgb(${color}, ${color}, 255)`;
    }

    return (<div style={{display: "flex"}}>
            <div style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                textAlign: "right",
                marginTop: "24px"
                }}
                ><strong>Predictions</strong>
            </div>
            <div>
                <div style={{textAlign: "left"}}><strong>Ground Truth</strong></div>
                <div style={{display: "flex", textAlign: "center"}}>
                    <ListGroup>
                        <ListGroup.Item variant={componentColor}>-</ListGroup.Item>
                        <ListGroup.Item variant={componentColor}>up</ListGroup.Item>
                        <ListGroup.Item variant={componentColor}>neutral</ListGroup.Item>
                        <ListGroup.Item variant={componentColor}>down</ListGroup.Item>
                    </ListGroup>
                    {confusionMatrix.map((column, index) => {
                        return (
                            <ListGroup key={index}>
                                <ListGroup.Item variant={componentColor}>
                                    {xLabel[index]}
                                </ListGroup.Item>
                                <ListGroup.Item style={{backgroundColor: getRGB(column[0])}}>
                                    {index === 0 ? (<strong>{column[0].toFixed(2)}</strong>) : (column[0].toFixed(2))}
                                </ListGroup.Item>
                                <ListGroup.Item style={{backgroundColor: getRGB(column[1])}}>
                                    {index === 1 ? (<strong>{column[1].toFixed(2)}</strong>) : (column[1].toFixed(2))}
                                </ListGroup.Item>
                                <ListGroup.Item style={{backgroundColor: getRGB(column[2])}}>
                                    {index === 2 ? (<strong>{column[2].toFixed(2)}</strong>) : (column[2].toFixed(2))}
                                </ListGroup.Item>
                            </ListGroup>
                        )})
                    }
                </div>
                <div style={{textAlign: "center", color: "grey"}}>data from latest {history} predictions</div>
            </div>
        </div>
    );
}