import { FONT_SIZES } from "@/constants/themes/font";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { Text } from "react-native";

const Icon: React.FC<{ char: string }> = ({ char }: { char: string }) => {
    return <Text style={{ fontSize: FONT_SIZES.xl, color: DESIGN_TOKENS.textIcon }}>{char}</Text>
}


export default Icon;