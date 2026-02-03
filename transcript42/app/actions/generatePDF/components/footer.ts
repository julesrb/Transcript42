export const createFooter = (campus_id: number) => {
    return {
        stack: [
            {
                text: campus_id == 51 ? 'www.42berlin.de – @42berlin\nEingetragener Verein, gemeinn\u00fctzig (equivalent to non-profit charity organisation)\nRegister No: VR 201961' : '',
                alignment: 'center',
                style: 'footer'
            }
        ],
        margin: [35, 10, 35, 0]
    };
};
