import path from "path";

export const getFonts = (projectRoot: string) => {
    const fontsDir = path.join(projectRoot, "assets/fonts/Roboto");
    return {
        Roboto: {
            normal: path.join(fontsDir, "Roboto-Regular.ttf"),
            italics: path.join(fontsDir, "Roboto-Italic.ttf")
        },
        RobotoMedium: {
            normal: path.join(fontsDir, "Roboto-Medium.ttf"),
            italics: path.join(fontsDir, "Roboto-MediumItalic.ttf")
        },
        RobotoBold: {
            normal: path.join(fontsDir, "Roboto-Bold.ttf"),
            italics: path.join(fontsDir, "Roboto-BoldItalic.ttf")
        },
        RobotoBlack: {
            normal: path.join(fontsDir, "Roboto-Black.ttf"),
            italics: path.join(fontsDir, "Roboto-BlackItalic.ttf")
        }
    };
};
