import { HeaderData } from "../lib/header-formatter";

export const createHeader = (currentPage: number, pageCount: number, campus_id: number, headerData: HeaderData, logoBase64: string) => {
    const {
        language,
        advanced,
        date_issued,
        pool_date,
        core_start,
        core_end,
        specialization,
        firstName,
        lastName,
        dateOfBirth,
        locationOfBirth
    } = headerData;

    return {
        stack: [
            {
                columns: [
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        image: logoBase64,
                                        width: 80,
                                        margin: [0, -10, 0, 0]
                                    },
                                    {
                                        stack: [
                                            { text: campus_id === 51 ? 'BERLIN' : '', font: 'RobotoBlack', italics: true },
                                            { text: campus_id === 51 ? 'Harzer Straße 39' : '' },
                                            { text: campus_id === 51 ? '12059 Berlin' : '' },
                                            { text: campus_id === 51 ? 'GERMANY' : '' },
                                        ],
                                        margin: [5, 34, 0, 0]
                                    }
                                ]
                            },
                            {
                                stack: [
                                    {
                                        text: campus_id == 51 ?
                                            language === 'en' ?
                                                'I, Daniel Hadley, Pedagogy Lead of 42 Berlin, certify that the above-named student has met academic requirements as of the date issued. This transcript is issued upon request for all official purposes.'
                                                : 'Ich, Daniel Hadley, P\u00e4dagogischer Leiter von 42 Berlin, best\u00e4tige, dass die oben genannte Person zum Ausstellungs- datum alle Voraussetzungen erf\u00fcllt hat. Dieses Zeugnis wird auf Anfrage f\u00fcr offizielle Zwecke ausgestellt.'
                                            : '\n\n\n',
                                        alignment: 'justify'
                                    },
                                ],
                                margin: [0, 7, 0, 0]
                            }
                        ],
                        margin: [0, 0, 6, 0]

                    },
                    {
                        stack: [
                            { text: language === 'en' ? 'TRANSCRIPT OF ACADEMIC RECORDS' : 'ZEUGNIS DER AKADEMISCHEN LEISTUNGEN', style: 'headerTitle' },
                            {
                                text: `${firstName} ${lastName}`.toUpperCase(),
                                style: 'headerTitle'
                            },
                            {
                                columns: [
                                    {
                                        width: 170,
                                        stack: [
                                            { text: language === 'en' ? 'Date of birth:' : 'Geburtsdatum:' },
                                            { text: language === 'en' ? 'Location of birth:' : 'Geburtsort:' },
                                            { text: language === 'en' ? 'Date issued:' : 'Ausstellungsdatum:' },
                                            { text: language === 'en' ? 'Passed Selection in:' : 'Auswahl bestanden in:' },
                                            { text: language === 'en' ? 'Core Curriculum started on:' : 'Kernstudium begonnen am:' },
                                            { text: language === 'en' ? 'Core Curriculum completed on:' : 'Kernstudium abgeschlossen am:' },
                                            advanced ?
                                                { text: language === 'en' ? 'Specialization track:' : 'Spezialisierung:' } : null
                                        ]
                                    },
                                    {
                                        stack: [
                                            { text: dateOfBirth },
                                            { text: locationOfBirth },
                                            { text: date_issued },
                                            { text: pool_date },
                                            { text: core_start },
                                            { text: core_end },
                                            advanced ?
                                                { text: specialization } : null,
                                        ]
                                    }
                                ],
                                margin: [0, 10, 0, 0]
                            }
                        ],
                        margin: [0, 0, 5, 0]
                    }
                ]
            },
            {
                text: `Page ${currentPage} / ${pageCount}`,
                alignment: 'right'
            }
        ],
        margin: [35, 24, 35, 0]
    };
};

