import React, { useState, useCallback } from 'react';

import BarcodeScanner from '../modules/BarcodeScanner';

const BarcodeScreen: React.FC = () => {

    const [barcodes, setBarcodes] = useState<String[]>([]);
    const [showScanner, setShowScanner] = useState(false);

    const addBarcode = useCallback((barcode: String) => {
        let newBarcodes = barcodes.concat([barcode]);
        setBarcodes(newBarcodes);
    }, [barcodes]);

    const onCancel = () => {
        setShowScanner(!showScanner);
    }

    return (
        <div id="BarcodeScreen">
            <BarcodeScanner hidden={!showScanner} onDetect={(data) => {addBarcode(data)}} onClose={() => onCancel()} />
            <br />
            <br />
            <span className="oneline">
                <h1>Barcodes</h1>
                <button type="button" onClick={() => setShowScanner(true)}>Add Barcode</button>
            </span>
            <ul>
                {barcodes.map((barcode, id) => 
                    <li key={id} style={{textAlign: "center"}}>{barcode}</li>
                )}
            </ul>
        </div>
    )
}

export default BarcodeScreen;