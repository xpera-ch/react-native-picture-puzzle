/// <reference types="react" />
import { ViewStyle } from 'react-native';
export declare type ObscureViewProps = {
    readonly children: JSX.Element;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
    readonly style?: ViewStyle;
    readonly top: number;
};
export default function ObscureView({ bottom, left, right, top, children, style, }: ObscureViewProps): JSX.Element;
