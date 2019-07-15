import React, { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';

import humain_debout from '../humain_debout.jpg';
import humain_debout2 from '../humain_debout-2.jpg';
import nez from '../nez.png';

export const Humans = () => {
    const [imgInfo, setImgInfo] = useState({});

    const getPose = async () => {
        const imageScaleFactor = 0.2;
        const flipHorizontal = false;
        const outputStride = 16;
        const humainDeboutElement = document.getElementById('humain_debout');
        const humainDebout2Element = document.getElementById('humain_debout2');
        // load the posenet model
        const net = await posenet.load();
        console.log('loaded');
        const pose = await net.estimateSinglePose(humainDeboutElement, imageScaleFactor, flipHorizontal, outputStride);
        console.log(pose);
        setImgInfo(pose);
        const pose2 = await net.estimateSinglePose(
            humainDebout2Element,
            imageScaleFactor,
            flipHorizontal,
            outputStride
        );
        console.log(pose2);
    };

    useEffect(() => {
        try {
            getPose();
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <div className="Humans">
            <img src={humain_debout} alt="logo" className="absElement" id="humain_debout" />
            <img src={humain_debout2} alt="logo" className="absElement" id="humain_debout2" />
            {!!Object.keys(imgInfo).length ? (
                <img
                    src={nez}
                    alt="nez"
                    style={{ top: imgInfo.keypoints[0].position.y, left: imgInfo.keypoints[0].position.x }}
                    className="absElement superpose"
                />
            ) : (
                <p style={{ display: 'inlineBlock' }}>Loading </p>
            )}
        </div>
    );
};
