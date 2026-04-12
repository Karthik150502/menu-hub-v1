import { FONT_SIZES } from "@/constants/themes/font";
import { Text } from "react-native";

const Icon: React.FC<{ char: string }> = ({ char }: { char: string }) => {
    return <Text style={{ fontSize: FONT_SIZES.xl, color: 'rgba(255,255,255,0.7)' }}>{char}</Text>
}


export default Icon;