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
    let viewportRef = useRef<HTMLDivElement>(null);
    let checkmarkRef = useRef<HTMLDivElement>(null);

    const stop = () => {
        viewportRef.current?.querySelector("video")?.pause();
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
                multiple: false
            }, (err: any) => {

                if (err) {
                    console.log(err);
                    return
                }

                Quagga.start();
            });

            Quagga.onDetected((data: any) => {

                if (viewportRef.current !== null && checkmarkRef.current !== null && !viewportRef.current.classList.contains("blur")) {
                    viewportRef.current.classList.add("blur");
                    viewportRef.current.querySelector("video")?.pause(); // Safari goes black without pause and timeout

                    // Start Checkmark Animation
                    let animObj = lottie.loadAnimation({
                        container: checkmarkRef.current,
                        renderer: 'svg',
                        loop: false,
                        autoplay: true,
                        animationData: checkmark
                    });

                    onDetect(data.codeResult.code);

                    // In 2 seconds stop Quagga, move the component out of sight, and run the onDetect function
                    setTimeout(() => {
                        console.log("Quagga stopped");
                        Quagga.stop();
                        animObj.destroy();
                        if (viewportRef.current !== null) {
                            viewportRef.current.classList.remove("blur");
                        }
                        onClose();
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
            <div id="interactive" className="viewport" ref={viewportRef}>
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
