export class Color {
    public static RESET : string = "\x1b[0m";  // Text Reset

    // Regular Colors
    public static BLACK : string = "\x1b[30m";   // BLACK
    public static RED : string = "\x1b[31m";     // RED
    public static GREEN : string = "\x1b[32m";   // GREEN
    public static YELLOW : string = "\x1b[33m";  // YELLOW
    public static BLUE : string = "\x1b[34m";    // BLUE
    public static PURPLE : string = "\x1b[35m";  // PURPLE
    public static CYAN : string = "\x1b[36m";    // CYAN
    public static WHITE : string = "\x1b[37m";   // WHITE

    // Bold
    public static BLACK_BOLD : string = "\x1b[30m";  // BLACK
    public static RED_BOLD : string = "\x1b[31m";    // RED
    public static GREEN_BOLD : string = "\x1b[32m";  // GREEN
    public static YELLOW_BOLD : string = "\x1b[33m"; // YELLOW
    public static BLUE_BOLD : string = "\x1b[34m";   // BLUE
    public static PURPLE_BOLD : string = "\x1b[35m"; // PURPLE
    public static CYAN_BOLD : string = "\x1b[36m";   // CYAN
    public static WHITE_BOLD : string = "\x1b[37m";  // WHITE

    // Underline
    public static BLACK_UNDERLINED : string = "\x1b[30m";  // BLACK
    public static RED_UNDERLINED : string = "\x1b[31m";    // RED
    public static GREEN_UNDERLINED : string = "\x1b[32m";  // GREEN
    public static YELLOW_UNDERLINED : string = "\x1b[33m"; // YELLOW
    public static BLUE_UNDERLINED : string = "\x1b[34m";   // BLUE
    public static PURPLE_UNDERLINED : string = "\x1b[35m"; // PURPLE
    public static CYAN_UNDERLINED : string = "\x1b[36m";   // CYAN
    public static WHITE_UNDERLINED : string = "\x1b[37m";  // WHITE

    // Background
    public static BLACK_BACKGROUND : string = "\x1b[40m";  // BLACK
    public static RED_BACKGROUND : string = "\x1b[41m";    // RED
    public static GREEN_BACKGROUND : string = "\x1b[42m";  // GREEN
    public static YELLOW_BACKGROUND : string = "\x1b[43m"; // YELLOW
    public static BLUE_BACKGROUND : string = "\x1b[44m";   // BLUE
    public static PURPLE_BACKGROUND : string = "\x1b[45m"; // PURPLE
    public static CYAN_BACKGROUND : string = "\x1b[46m";   // CYAN
    public static WHITE_BACKGROUND : string = "\x1b[47m";  // WHITE

    // High Intens
    public static BLACK_BRIGHT : string = "\x1b[90m";  // BLACK
    public static RED_BRIGHT : string = "\x1b[91m";    // RED
    public static GREEN_BRIGHT : string = "\x1b[92m";  // GREEN
    public static YELLOW_BRIGHT : string = "\x1b[93m"; // YELLOW
    public static BLUE_BRIGHT : string = "\x1b[94m";   // BLUE
    public static PURPLE_BRIGHT : string = "\x1b[95m"; // PURPLE
    public static CYAN_BRIGHT : string = "\x1b[96m";   // CYAN
    public static WHITE_BRIGHT : string = "\x1b[97m";  // WHITE

    // Bold High
    public static BLACK_BOLD_BRIGHT : string = "\x1b[90m"; // BLACK
    public static RED_BOLD_BRIGHT : string = "\x1b[91m";   // RED
    public static GREEN_BOLD_BRIGHT : string = "\x1b[92m"; // GREEN
    public static YELLOW_BOLD_BRIGHT : string = "\x1b[93m";// YELLOW
    public static BLUE_BOLD_BRIGHT : string = "\x1b[94m";  // BLUE
    public static PURPLE_BOLD_BRIGHT : string = "\x1b[95m";// PURPLE
    public static CYAN_BOLD_BRIGHT : string = "\x1b[96m";  // CYAN
    public static WHITE_BOLD_BRIGHT : string = "\x1b[97m"; // WHITE

    // High Intense backgrounds
    public static BLACK_BACKGROUND_BRIGHT : string = "\x1b[100m";// BLACK
    public static RED_BACKGROUND_BRIGHT : string = "\x1b[101m";// RED
    public static GREEN_BACKGROUND_BRIGHT : string = "\x1b[102m";// GREEN
    public static YELLOW_BACKGROUND_BRIGHT : string = "\x1b[103m";// YELLOW
    public static BLUE_BACKGROUND_BRIGHT : string = "\x1b[104m";// BLUE
    public static PURPLE_BACKGROUND_BRIGHT : string = "\x1b[105m"; // PURPLE
    public static CYAN_BACKGROUND_BRIGHT : string = "\x1b[106m";  // CYAN
    public static WHITE_BACKGROUND_BRIGHT : string = "\x1b[107m";   // WHITE

    private static findColor : RegExp = /(\x1b\[(?:\d+)*m)/g;

    public static extracter(s: string) : string {
        return s.replace(Color.findColor, "");
    }

    public static hasColor(s: string) : boolean {
        return Color.findColor.exec(s) != null;
    }

    public static colorify(origin : string)  : string {
        return Color.hasColor(origin) ? origin : origin.replace(/(\d+)/g, Color.CYAN + "$1" + Color.RESET);
    }

    public static c(color: number) {
        return "\x1b[" + color + "m";
    }

    public static to(str: string, color) {
        return color + str + Color.RESET;
    }
}