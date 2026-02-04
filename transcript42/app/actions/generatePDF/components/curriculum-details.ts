import { UserFormData } from "../../../types/user-form-data";

export const createCurriculumDetails = (userFormData: UserFormData) => {
    const isGerman = userFormData.language === 'de';

    const content = [
        { text: '', pageBreak: 'before' },
        {
            text: isGerman ? 'Details des Curriculums' : 'Details of the Curriculum',
            style: 'pageTitle',
            margin: [0, 0, 0, 20]
        },
        {
            text: isGerman
                ? 'Gegründet 2013 ist 42 ein globales Netzwerk von IT-Schulen, das skalierbare, hochwertige Softwareentwicklungsausbildung bietet. Unser innovatives Modell betont Peer-to-Peer-Lernen, projektbasiertes und praxisnahes Programmieren, wodurch Studierende innerhalb von 2 bis 5 Jahren branchenbereit werden. Das Curriculum ist in zwei Teile gegliedert: das Kerncurriculum, nach dessen Abschluss die Studierenden entweder mit dem fortgeschrittenen Curriculum fortfahren oder als Alumni abschließen können.'
                : 'Founded in 2013, 42 is a global network of ICT schools providing scalable, high-quality software engineering education. Our innovative model emphasizes peer-to-peer learning, project-based and hands-on programming, enabling students to become industry-ready within 2 to 5 years. The curriculum is divided into two parts: the Core Curriculum, after which students may either continue to the Advanced Curriculum or graduate as alumni.',
            alignment: 'justify',
            margin: [0, 0, 0, 20]
        },
        {
            text: isGerman
                ? 'Während des gesamten Kerncurriculums erworbene Fähigkeiten:'
                : 'Skills developed during the entire Core Curriculum:',
            style: 'descriptionTitle',
            margin: [0, 0, 0, 10]
        },
        {
            ul: isGerman ? [
                { text: [{ text: 'Algorithmen & KI: ', font: 'RobotoBold' }, 'Klassische Algorithmen, Datenstrukturen und asynchrone Logik.'], margin: [0, 1] },
                { text: [{ text: 'Grafik: ', font: 'RobotoBold' }, 'Bildbearbeitung, Formenzeichnen und ereignisgesteuerte Programmierung.'], margin: [0, 1] },
                { text: [{ text: 'Gruppen- & Sozialkompetenz: ', font: 'RobotoBold' }, 'Teamarbeit, Zusammenarbeit und Gruppendynamik.'], margin: [0, 1] },
                { text: [{ text: 'Imperative Programmierung: ', font: 'RobotoBold' }, 'C-Programmierung, Speicherverwaltung und Datenstrukturen.'], margin: [0, 1] },
                { text: [{ text: 'Objektorientierte Programmierung: ', font: 'RobotoBold' }, 'C++-Klassen, Vererbung, Templates und Abstraktion.'], margin: [0, 1] },
                { text: [{ text: 'Systemprogrammierung: ', font: 'RobotoBold' }, 'Unix-Systemaufrufe, Dateiverwaltung und Prozesssteuerung.'], margin: [0, 1] },
                { text: [{ text: 'Netzwerk & Systemadmin: ', font: 'RobotoBold' }, 'Linux-Systemeinrichtung, Benutzerverwaltung und grundlegende Netzwerkdienste.'], margin: [0, 1] },
                { text: [{ text: 'Web: ', font: 'RobotoBold' }, 'Full-Stack-Webentwicklung, MVC und UI/UX-Grundlagen.'], margin: [0, 1] },
            ] : [
                { text: [{ text: 'Algorithms & AI: ', font: 'RobotoBold' }, 'Classic algorithms, data structures, and asynchronous logic.'], margin: [0, 1] },
                { text: [{ text: 'Graphics: ', font: 'RobotoBold' }, 'Image manipulation, drawing shapes, and event-driven programming.'], margin: [0, 1] },
                { text: [{ text: 'Group & Interpersonal: ', font: 'RobotoBold' }, 'Teamwork, collaboration, and group dynamics.'], margin: [0, 1] },
                { text: [{ text: 'Imperative Programming: ', font: 'RobotoBold' }, 'C programming, memory management, and data structures.'], margin: [0, 1] },
                { text: [{ text: 'Object-Oriented Programming: ', font: 'RobotoBold' }, 'C++ classes, inheritance, templates, and abstraction.'], margin: [0, 1] },
                { text: [{ text: 'System Programming: ', font: 'RobotoBold' }, 'Unix system calls, file handling, and process control.'], margin: [0, 1] },
                { text: [{ text: 'Network & Sysadmin: ', font: 'RobotoBold' }, 'Linux system setup, user management, and basic network services.'], margin: [0, 1] },
                { text: [{ text: 'Web: ', font: 'RobotoBold' }, 'Full-stack web development, MVC, and UI/UX basics.'], margin: [0, 1] },
            ],
            margin: [0, 0, 0, 20]
        }
    ];

    if (userFormData.transcript_type === 'core_advanced') {
        content.push(
            {
                // @ts-ignore
                text: isGerman
                    ? 'Während der Spezialisierung erworbene Fähigkeiten:'
                    : 'Skills developed during the Specialization track:',
                style: 'descriptionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                // @ts-ignore
                ul: isGerman ? [
                    { text: [{ text: 'Algorithmen & KI: ', font: 'RobotoBold' }, 'Maschinelles Lernen und Datenverarbeitungstechniken.'], margin: [0, 1] },
                    { text: [{ text: 'Sicherheit: ', font: 'RobotoBold' }, 'Systemhärtung, Netzwerksicherheit, Verschlüsselung, Schwachstellenanalyse.'], margin: [0, 1] },
                    { text: [{ text: 'DevOps: ', font: 'RobotoBold' }, 'CI/CD, automatisierte Deployments, Containerisierung, Infrastructure as Code.'], margin: [0, 1] },
                    { text: [{ text: 'Web & Mobile: ', font: 'RobotoBold' }, 'Responsive Web-Apps mit HTML, CSS, JS, Backend-Frameworks; Mobile-First-Design.'], margin: [0, 1] },
                    { text: [{ text: 'System & Kernel: ', font: 'RobotoBold' }, 'OS-Komponenten, Gerätetreiber, Prozessplanung, Speicherverwaltung.'], margin: [0, 1] },
                    { text: [{ text: 'Grafik & Spiele: ', font: 'RobotoBold' }, 'Grafikanwendungen mit Rendering, Ereignisbehandlung und Spielmechanik.'], margin: [0, 1] },
                    { text: [{ text: 'Kryptographie & Mathematik: ', font: 'RobotoBold' }, 'Kryptographische Algorithmen, sichere Protokolle, mathematische Beweise.'], margin: [0, 1] },
                    { text: [{ text: 'Entwicklung: ', font: 'RobotoBold' }, 'Modulare, getestete und wartbare Softwarelösungen.'], margin: [0, 1] },
                ] : [
                    { text: [{ text: 'Algorithms & AI: ', font: 'RobotoBold' }, 'Machine learning and data processing techniques.'], margin: [0, 1] },
                    { text: [{ text: 'Security: ', font: 'RobotoBold' }, 'System hardening, network security, encryption, vulnerability assessment.'], margin: [0, 1] },
                    { text: [{ text: 'DevOps: ', font: 'RobotoBold' }, 'CI/CD pipelines, automated deployments, containerization, infrastructure as code.'], margin: [0, 1] },
                    { text: [{ text: 'Web & Mobile: ', font: 'RobotoBold' }, 'Responsive web apps with HTML, CSS, JS, backend frameworks; mobile-first design.'], margin: [0, 1] },
                    { text: [{ text: 'System & Kernel: ', font: 'RobotoBold' }, 'Low-level OS components, device drivers, scheduling, memory management.'], margin: [0, 1] },
                    { text: [{ text: 'Graphics & Gaming: ', font: 'RobotoBold' }, 'Graphical apps using rendering, event handling, and game logic.'], margin: [0, 1] },
                    { text: [{ text: 'Cryptography & Maths: ', font: 'RobotoBold' }, 'Cryptographic algorithms, secure communication protocols, proofs.'], margin: [0, 1] },
                    { text: [{ text: 'Development: ', font: 'RobotoBold' }, 'Modular, tested, maintainable software solutions.'], margin: [0, 1] },
                ],
                margin: [0, 0, 0, 20]
            }
        );
    }

    return content;
};
