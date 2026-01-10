export const MOCK_CUSTOMERS = [
    { id: '6627123691776', name: 'Karan.jain', email: 'karan.jain@metadologie.com', phone: '2', avatar: 'https://ui-avatars.com/api/?name=Karan+Jain&background=0D8ABC&color=fff' },
    { id: '1', name: 'Dhruv.jindal', email: 'dhruv.jindal@metadologie.com', phone: '1', avatar: 'https://ui-avatars.com/api/?name=Dhruv+Jindal&background=0D8ABC&color=fff' },
    { id: '5', name: 'Ushyam076', email: 'ushyam076@gmail.com', phone: '5', avatar: 'https://ui-avatars.com/api/?name=Ushy+Am&background=0D8ABC&color=fff' },
    { id: '6627102884096', name: 'Karan.jain', email: 'karan.jain@metadologie.com', phone: '6627102884096', avatar: 'https://ui-avatars.com/api/?name=Karan+Jain&background=0D8ABC&color=fff' },
];

export const MOCK_TRANSACTIONS = [
    {
        status: 'SETTLING',
        created: 'Jan 9th 2026',
        description: 'Payment for Order #6627123691776',
        customerRef: '6627123691776',
        amount: '$10.20',
        paymentMethod: 'John Smith-Checking-3123',
        externalReference: '-',
        type: 'CHARGE'
    },
    {
        status: 'SETTLING',
        created: 'Jan 9th 2026',
        description: 'Payment for Order #6627123691776',
        customerRef: '6627123691776',
        amount: '$11.00',
        paymentMethod: 'John Smith-Checking-3123',
        externalReference: '-',
        type: 'CHARGE'
    },
    {
        status: 'SETTLING',
        created: 'Jan 9th 2026',
        description: 'Payment for Order #6627123691776',
        customerRef: '6627123691776',
        amount: '$11.00',
        paymentMethod: 'John Smith-Checking-3123',
        externalReference: '-',
        type: 'CHARGE'
    },
    {
        status: 'SETTLING',
        created: 'Dec 31st 2025',
        description: 'Payment for Order #255',
        customerRef: '2',
        amount: '$115.00',
        paymentMethod: 'Jane Doe-visa-1111',
        externalReference: '-',
        type: 'CHARGE'
    },
    {
        status: 'SETTLING',
        created: 'Dec 31st 2025',
        description: 'Payment for Order #253',
        customerRef: '2',
        amount: '$115.00',
        paymentMethod: 'Jane Doe-visa-1111',
        externalReference: '-',
        type: 'CHARGE'
    },
    {
        status: 'SETTLING',
        created: 'Dec 30th 2025',
        description: 'Payment for Order #247',
        customerRef: '2',
        amount: '$90.00',
        paymentMethod: 'Jane Doe-visa-1111',
        externalReference: '-',
        type: 'CHARGE'
    },
];

export const MOCK_CONVERSATIONS = [
    {
        status: 'Resolved',
        created: 'Jan 9th 2026',
        updated: 'Jan 9th 2026',
        address: '(512) 555-1234',
        customerRef: '6627123691776',
        expiration: 'Feb 23rd 2026',
    },
    {
        status: 'Resolved',
        created: 'Jan 9th 2026',
        updated: 'Jan 9th 2026',
        address: '(512) 555-1234',
        customerRef: '6627123691776',
        expiration: 'Feb 23rd 2026',
    },
    {
        status: 'In Progress',
        created: 'Jan 9th 2026',
        updated: 'Jan 9th 2026',
        address: 'Dhruv.jindal@metadologie.com',
        customerRef: '1',
        expiration: 'Feb 23rd 2026',
    },
    {
        status: 'Resolved',
        created: 'Jan 9th 2026',
        updated: 'Jan 9th 2026',
        address: '(512) 555-1234',
        customerRef: '6627102884096',
        expiration: 'Feb 23rd 2026',
    },
    {
        status: 'In Progress',
        created: 'Jan 5th 2026',
        updated: 'Jan 5th 2026',
        address: 'Dhruv.jindal@metadologie.com',
        customerRef: '1',
        expiration: 'Feb 19th 2026',
    },
];
