import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import { Spinner } from 'react-bootstrap';

export default function SinglePrediction(props) {

    const {prediction, groundTruth, time} = props;

    if(prediction === null) {
        return <div style={{width: "18rem", margin: "auto", textAlign: "center"}}><Spinner animation="border" variant="primary" /></div>;
    }

    if(prediction === "error") {
        return <div style={{width: "18rem", margin: "auto", textAlign: "center", color: "red"}}><strong>Error</strong></div>;
    }

    return (
        <div style={{width: "18rem"}}>
            <Card>
                <ListGroup variant="flush" style={{textAlign: "center"}}>
                    <ListGroup.Item variant={((prediction === 1) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === 1 ? ("warning") : ("light")))}>
                        Up
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === 0) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === 0 ? ("warning") : ("light")))}
                    >
                        Neutral
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === -1) ? (prediction === groundTruth ? ("success") : ("danger")) : (groundTruth === -1 ? ("warning") : ("light")))}
                    >
                        Down
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            <p className="fw-lighter" style={{textAlign: "center"}}>{time}</p>
        </div>
    )

}