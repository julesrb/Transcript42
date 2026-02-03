export const createCurriculumDetails = () => {
    return [
        { text: '', pageBreak: 'before' },
        { text: 'Details of the Curriculum', style: 'pageTitle', margin: [0, 0, 0, 20] },
        {
            text: 'This section is reserved for additional student information, achievements, and certifications.',
            style: 'sectionHeader',
            margin: [0, 0, 0, 10]
        },
        {
            text: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n',
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
                'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n',
                'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, ',
                'eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
            ],
            fontSize: 10,
            lineHeight: 1.5,
            alignment: 'justify'
        }
    ];
};
