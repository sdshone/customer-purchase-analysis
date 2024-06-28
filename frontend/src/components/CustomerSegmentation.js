// // frontend/src/components/CustomerSegmentation.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Chart } from 'react-charts';

// const CustomerSegmentation = () => {
//     const [customerSegmentation, setCustomerSegmentation] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:8000/analysis/customer_segmentation/', {
//             headers: {
//               'Content-Type': 'application/json',
//               'Access-Control-Allow-Origin': '*',
//             },}).then(response => {
//             setCustomerSegmentation(response.data.customer_segments);
//         });
//     }, []);

//     const data = React.useMemo(
//         () => [
//             {
//                 label: 'Customer Segmentation',
//                 data: customerSegmentation.map(segment => ({
//                     x: segment.customer_id,
//                     y: segment.total_purchase
//                 }))
//             }
//         ],
//         [customerSegmentation]
//     );

//     const series = React.useMemo(
//         () => ({
//             type: 'bar'
//         }),
//         []
//     );

//     const axes = React.useMemo(
//         () => [
//             { primary: true, type: 'ordinal', position: 'bottom' },
//             { type: 'linear', position: 'left' }
//         ],
//         []
//     );

//     return (
//         <div>
//             <h2>Customer Segmentation</h2>
//             <div style={{ width: '600px', height: '400px' }}>
//                 <Chart data={data} series={series} axes={axes} tooltip />
//             </div>
//         </div>
//     );
// };

// export default CustomerSegmentation;


// frontend/src/components/CustomerAnalysis.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-charts';

const CustomerAnalysis = () => {
    const [customerData, setCustomerData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/analysis/customer_segmentation/').then(response => {
            setCustomerData(response.data.customer_segments);
        });
    }, []);

    const categorizeCustomers = (data) => {
        const lowFrequency = data.filter(customer => customer.purchase_count < 50);
        const mediumFrequency = data.filter(customer => customer.purchase_count >= 50 && customer.purchase_count < 200);
        const highFrequency = data.filter(customer => customer.purchase_count >= 200);
        return { lowFrequency, mediumFrequency, highFrequency };
    };

    const { lowFrequency, mediumFrequency, highFrequency } = categorizeCustomers(customerData);

    const data = React.useMemo(
        () => [
            {
                label: 'Low Frequency',
                data: [{x: 'Low', y: lowFrequency.length}]
            },
            {
                label: 'Medium Frequency',
                data: [{x: 'Medium', y: mediumFrequency.length}]
            },
            {
                label: 'High Frequency',
                data: [{x: 'High', y: highFrequency.length}]
            },
            // {
            //     label: 'Medium Frequency',
            //     data: mediumFrequency.map(customer => ({
            //         x: customer.customer_id,
            //         y: customer.total_purchase
            //     }))
            // },
            // {
            //     label: 'High Frequency',
            //     data: highFrequency.map(customer => ({
            //         x: customer.customer_id,
            //         y: customer.total_purchase
            //     }))
            // }
        ],
        [lowFrequency, mediumFrequency, highFrequency]
    );

    const series = React.useMemo(
        () => ({
            type: 'bar'
        }),
        []
    );

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    );

    return (
        <div>
            <h2>Customer Purchase Frequency Analysis</h2>
            <div style={{ width: '1200px', height: '1000px' }}>
                <Chart data={data} series={series} axes={axes} tooltip />
            </div>
        </div>
    );
};

export default CustomerAnalysis;
