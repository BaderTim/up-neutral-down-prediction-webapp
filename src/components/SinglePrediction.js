import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'

export default function SinglePrediction(props) {

    const {prediction, groundTruth, time} = props;

    return (
        <div style={{width: "18rem"}}>
            <Card>
                <ListGroup variant="flush" style={{textAlign: "center"}}>
                    <ListGroup.Item variant={((prediction === 1) ? (prediction === groundTruth ? ("success") : ("danger")) : ("light"))}>
                        Up
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === 0) ? (prediction === groundTruth ? ("success") : ("danger")) : ("light"))}
                    >
                        Neutral
                    </ListGroup.Item>
                    <ListGroup.Item 
                        variant={((prediction === -1) ? (prediction === groundTruth ? ("success") : ("danger")) : ("light"))}
                    >
                        Down
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            <p className="fw-lighter" style={{textAlign: "center"}}>{time}</p>
        </div>
    )

}