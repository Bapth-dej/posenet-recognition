import React, { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';

import nez from '../nez.png';

export const Webcam = () => {
    const [net, setNet] = useState(null);
    const [pose, setPose] = useState({});

    const loadPosenet = async () => {
        // load the posenet model
        const loadedNet = await posenet.load();
        console.log('foo', loadedNet);
        setNet(loadedNet);
    };

    const getPose = async () => {
        const imageScaleFactor = 0.8;
        const flipHorizontal = true;
        const outputStride = 16;
        const webcamElement = document.getElementById('videoElement');
        console.log('net', net);
        // const altNet = await posenet.load();

        const newPose = await net.estimateSinglePose(webcamElement, {
            imageScaleFactor,
            flipHorizontal,
            outputStride
        });
        setPose(newPose);
    };

    const setupWebcam = async () => {
        const video = document.getElementById('videoElement');
        if (navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 500, height: 500 } });
                video.srcObject = stream;
            } catch (e) {
                console.log(e);
            } finally {
                console.log('setUpWebcam finished');
            }
        }
    };

    const foo = async () => {
        try {
            await loadPosenet();
            await setupWebcam();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        foo();
    }, []);

    useEffect(() => {
        if (net) {
            try {
                console.log('pose', pose);
                getPose();
            } catch (e) {
                console.log(e);
            }
        }
    }, [pose, net]);

    return (
        <div className="Webcam">
            <video id="videoElement" autoPlay={true} width={500} height={500}></video>

            {!!Object.keys(pose).length ? (
                <img
                    src={nez}
                    alt="nez"
                    style={{ top: pose.keypoints[0].position.y, left: pose.keypoints[0].position.x }}
                    className="absElement superpose"
                />
            ) : (
                <p style={{ display: 'inlineBlock' }}>Loading </p>
            )}
        </div>
    );
};
