import React, { useState, useCallback } from 'react';

import BarcodeScanner from '../modules/BarcodeScanner';

// const BarcodeScreen: React.FC = () => {

//     const [barcodes, setBarcodes] = useState<String[]>([]);
//     const [showScanner, setShowScanner] = useState(false);

//     const onCancel = () => {
//         setShowScanner(!showScanner);
//     }

//     return (
//         <div id="BarcodeScreen">
//             <BarcodeScanner hidden={!showScanner} barcodes={barcodes} onClose={() => onCancel()} />
//             <br />
//             <br />
//             <span className="oneline">
//                 <h1>Barcodes</h1>
//                 <button type="button" onClick={() => setShowScanner(true)}>Add Barcode</button>
//             </span>
//             <ul>
//                 {barcodes.map((barcode, id) => 
//                     <li key={id} style={{textAlign: "center"}}>{barcode}</li>
//                 )}
//             </ul>
//         </div>
//     )
// }

// type BarcodeScreenProps = {

// }

class BarcodeScreen extends React.Component {

    readonly state = {
        showScanner: false,
        barcodes: new Array<String>()
    }

    closeScanner = () => {
        this.setState({
            showScanner: false
        });
    }

    addBarcode = (barcode: String) => {
        this.setState({
            barcodes: this.state.barcodes.concat(barcode)
        });
    }

    render() {
        return (
            <div id="BarcodeScreen">
                <BarcodeScanner hidden={!this.state.showScanner} onDetect={(data) => this.addBarcode(data)} onClose={() => this.closeScanner()} />
                <br />
                <br />
                <span className="oneline">
                    <h1>Barcodes</h1>
                    <button type="button" onClick={() => this.setState({showScanner: true})}>Add Barcode</button>
                </span>
                <ul>
                    {this.state.barcodes.map((barcode, id) => 
                        <li key={id} style={{textAlign: "center"}}>{barcode}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default BarcodeScreen;