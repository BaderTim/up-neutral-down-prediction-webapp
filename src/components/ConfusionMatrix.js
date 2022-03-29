import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

export default function ConfusionMatrix(props) {

    const { confusionMatrix } = props;
    const xLabel = ["up", "neutral", "down"]
    const getRGB = (value) => {
        const color = (1-value/2) * 255;
        return `rgb(${color}, ${color}, 255)`;
    }

    return (<div style={{display: "flex"}}>
            <div style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                textAlign: "right",
                marginTop: "24px"
                }}
                >Predictions
            </div>
            <div>
                <div style={{textAlign: "left"}}>Ground Truth</div>
                <div style={{display: "flex", textAlign: "center"}}>
                    <ListGroup>
                        <ListGroup.Item>-</ListGroup.Item>
                        <ListGroup.Item>up</ListGroup.Item>
                        <ListGroup.Item>neutral</ListGroup.Item>
                        <ListGroup.Item>down</ListGroup.Item>
                    </ListGroup>
                    {confusionMatrix.map((column, index) => {
                        return (
                            <ListGroup>
                                <ListGroup.Item>
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
            </div>
        </div>
    );
}