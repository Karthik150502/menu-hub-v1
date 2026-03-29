import { Text } from "react-native";

const Icon: React.FC<{ char: string }> = ({ char }: { char: string }) => {
    return <Text style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)' }}>{char}</Text>
}


export default Icon;