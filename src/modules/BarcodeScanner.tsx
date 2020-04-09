import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/BarcodeScanner.scss';
import Quagga from 'quagga';
import lottie from 'lottie-web';

import crosshair from '../images/crosshair.svg';
import checkmark from '../images/checkmark.json';


type BarcodeScannerProps = {
    onDetect: (data: String) => void,
    onClose: () => void,
    hidden: boolean
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetect, onClose, hidden }) => {

    // If the browser doesn't support scanning a barcode, redirect home
    let redirect = false;
    if(!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)){
        redirect = true;
    }

    // References for the scanner, the viewport, and the checkmark animation
    let scannerRef = useRef<HTMLDivElement>(null);
    let checkmarkRef = useRef<HTMLDivElement>(null);

    const stop = () => {
        Quagga.stop();
        onClose();
    }

    useEffect(() => {
        if(!hidden){
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    constraints: {
                        facingMode: "environment"
                    }
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                numOfWorkers: navigator.hardwareConcurrency,
                decoder : {
                    readers : ["upc_reader"]
                },
                locate: false,
                multiple: false,
                debug: false
            }, (err: any) => {

                if (err) {
                    console.log(err);
                    return
                }

                Quagga.start();
            });

            Quagga.onDetected((data: any) => {

                if (scannerRef.current !== null && checkmarkRef.current !== null && !scannerRef.current.classList.contains("finished")) {
                    scannerRef.current.classList.add("finished");
                    // viewportRef.current.querySelector("video")?.pause(); // Safari goes black without pause and timeout
                    let v = scannerRef.current.querySelectorAll("video");
                    v.forEach((video) => video.pause())

                    // Start Checkmark Animation
                    let animObj = lottie.loadAnimation({
                        container: checkmarkRef.current,
                        renderer: 'svg',
                        loop: false,
                        autoplay: true,
                        animationData: checkmark
                    });

                    // In 2 seconds stop Quagga, move the component out of sight, and run the onDetect function
                    setTimeout(() => {

                        animObj.destroy();
                        if (scannerRef.current !== null) {
                            scannerRef.current.classList.remove("finished");
                        }
                        onDetect(data.codeResult.code);
                        stop();
                    }, 2000);
                }
            });
        }
    });


    if (redirect) {
        return <Redirect to='/' />;
    }

    return (
        <div className={hidden? "hidden": ""} id="BarcodeScanner" ref={scannerRef}>
            <div id="interactive" className="viewport">
                <div id="scrim">
                    <img src={crosshair} className="crosshair" alt=""/>
                </div>
                <div className="checkmark" ref={checkmarkRef} />
            </div>
            <div id="cancelButton" onClick={() => {stop()}}>Cancel</div>
        </div>
    );
}

export default BarcodeScanner;
