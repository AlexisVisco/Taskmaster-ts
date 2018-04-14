export class Color {
    public static RESET = "\x1b[0m";
    public static BOLD = "\x1b[1m";
    public static DIM = "\x1b[2m";
    public static UNDERSCORE = "\x1b[4m";
    public static BLINK = "\x1b[5m";
    public static REVERSE = "\x1b[7m";
    public static HIDDEN = "\x1b[8m";

    // Regular Colors
    public static BLACK : string = "\x1b[30m";   // BLACK
    public static RED : string = "\x1b[31m";     // RED
    public static GREEN : string = "\x1b[32m";   // GREEN
    public static YELLOW : string = "\x1b[33m";  // YELLOW
    public static BLUE : string = "\x1b[34m";    // BLUE
    public static PURPLE : string = "\x1b[35m";  // PURPLE
    public static CYAN : string = "\x1b[36m";    // CYAN
    public static WHITE : string = "\x1b[37m";   // WHITE

    public static BLACK_BOLD : string = `${Color.BOLD}${Color.BLACK}`;
    public static RED_BOLD : string = `${Color.BOLD}${Color.RED}`;
    public static GREEN_BOLD : string = `${Color.BOLD}${Color.GREEN}`;
    public static YELLOW_BOLD : string = `${Color.BOLD}${Color.YELLOW}`;
    public static BLUE_BOLD : string = `${Color.BOLD}${Color.BLUE}`;
    public static PURPLE_BOLD : string = `${Color.BOLD}${Color.PURPLE}`;
    public static CYAN_BOLD : string = `${Color.BOLD}${Color.CYAN}`;
    public static WHITE_BOLD : string = `${Color.BOLD}${Color.WHITE}`;


    public static BLACK_UNDER : string = `${Color.UNDERSCORE}${Color.BLACK}`;
    public static RED_UNDER : string = `${Color.UNDERSCORE}${Color.RED}`;
    public static GREEN_UNDER : string = `${Color.UNDERSCORE}${Color.GREEN}`;
    public static YELLOW_UNDER : string = `${Color.UNDERSCORE}${Color.YELLOW}`;
    public static BLUE_UNDER : string = `${Color.UNDERSCORE}${Color.BLUE}`;
    public static PURPLE_UNDER : string = `${Color.UNDERSCORE}${Color.PURPLE}`;
    public static CYAN_UNDER : string = `${Color.UNDERSCORE}${Color.CYAN}`;
    public static WHITE_UNDER : string = `${Color.UNDERSCORE}${Color.WHITE}`;

    public static BLACK_DIM : string = `${Color.DIM}${Color.BLACK}`;
    public static RED_DIM : string = `${Color.DIM}${Color.RED}`;
    public static GREEN_DIM : string = `${Color.DIM}${Color.GREEN}`;
    public static YELLOW_DIM : string = `${Color.DIM}${Color.YELLOW}`;
    public static BLUE_DIM : string = `${Color.DIM}${Color.BLUE}`;
    public static PURPLE_DIM : string = `${Color.DIM}${Color.PURPLE}`;
    public static CYAN_DIM : string = `${Color.DIM}${Color.CYAN}`;
    public static WHITE_DIM : string = `${Color.DIM}${Color.WHITE}`;


    public static BLACK_BACKGROUND : string = "\x1b[40m";
    public static RED_BACKGROUND : string = "\x1b[41m";
    public static GREEN_BACKGROUND : string = "\x1b[42m";
    public static YELLOW_BACKGROUND : string = "\x1b[43m";
    public static BLUE_BACKGROUND : string = "\x1b[44m";
    public static PURPLE_BACKGROUND : string = "\x1b[45m";
    public static CYAN_BACKGROUND : string = "\x1b[46m";
    public static WHITE_BACKGROUND : string = "\x1b[47m";

    public static BLACK_BRIGHT : string = "\x1b[90m";  // BLACK
    public static RED_BRIGHT : string = "\x1b[91m";    // RED
    public static GREEN_BRIGHT : string = "\x1b[92m";  // GREEN
    public static YELLOW_BRIGHT : string = "\x1b[93m"; // YELLOW
    public static BLUE_BRIGHT : string = "\x1b[94m";   // BLUE
    public static PURPLE_BRIGHT : string = "\x1b[95m"; // PURPLE
    public static CYAN_BRIGHT : string = "\x1b[96m";   // CYAN
    public static WHITE_BRIGHT : string = "\x1b[97m";  // WHITE

    public static BLACK_BOLD_BRIGHT : string = `${Color.BOLD}${Color.BLACK_BRIGHT}`;
    public static RED_BOLD_BRIGHT : string = `${Color.BOLD}${Color.RED_BRIGHT}`;
    public static GREEN_BOLD_BRIGHT : string = `${Color.BOLD}${Color.GREEN_BRIGHT}`;
    public static YELLOW_BOLD_BRIGHT : string = `${Color.BOLD}${Color.YELLOW_BRIGHT}`;
    public static BLUE_BOLD_BRIGHT : string = `${Color.BOLD}${Color.BLUE_BRIGHT}`;
    public static PURPLE_BOLD_BRIGHT : string = `${Color.BOLD}${Color.PURPLE_BRIGHT}`;
    public static CYAN_BOLD_BRIGHT : string = `${Color.BOLD}${Color.CYAN_BRIGHT}`;
    public static WHITE_BOLD_BRIGHT : string = `${Color.BOLD}${Color.WHITE_BRIGHT}`;

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