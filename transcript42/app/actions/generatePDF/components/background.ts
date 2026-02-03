interface PageSize {
    width: number;
    height: number;
}

export const createBackground = (pageSize: PageSize) => {
    return {
        canvas: [
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: pageSize.width,
                h: pageSize.height,
                color: '#daf5f9'
            }
        ]
    };
};
