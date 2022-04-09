import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import { Spinner } from 'react-bootstrap';

export default function SinglePrediction(props) {

    const {prediction, groundTruth, time, unsure} = props;
    const {componentColor} = props.mode;

    if(prediction === null) {
        return <div style={{width: "18rem", margin: "auto", textAlign: "center"}}><Spinner animation="border" variant="primary" /></div>;
    }

    if(prediction === "error") {
        return <div style={{width: "18rem", margin: "auto", textAlign: "center", color: "red"}}><strong>Error</strong></div>;
    }

    return (
        <div style={{width: "18rem"}}>
            {unsure > 0 && (<Card bg={componentColor} style={{marginBottom: "10px"}}>
                <ListGroup variant="flush" style={{textAlign: "center"}}>
                    <ListGroup.Item
                        variant={(prediction === 2) ? ("primary") : (componentColor)}
                    >
                        Unsure
                    </ListGroup.Item>
                </ListGroup>
            </Card>)}
            <Card bg={componentColor}>
                <ListGroup variant="flush" style={{textAlign: "center"}}>
                    <ListGroup.Item variant={((prediction === 1) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === 1 ? ("warning") : (componentColor)))}>
                        Up
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === 0) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === 0 ? ("warning") : (componentColor)))}
                    >
                        Neutral
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === -1) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === -1 ? ("warning") : (componentColor)))}
                    >
                        Down
                    </ListGroup.Item>
                
                </ListGroup>
            </Card>
            <p className="fw-lighter" style={{textAlign: "center"}}>{time}</p>
        </div>
    )

}