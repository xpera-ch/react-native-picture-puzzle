/// <reference types="react" />
import { ImageProps, ImageURISource } from 'react-native';
import { PuzzlePieces } from '../types';
export declare type PicturePuzzleProps = ImageProps & {
    readonly hidden: number | null;
    readonly size: number;
    readonly pieces: PuzzlePieces;
    readonly source: ImageURISource | number;
    readonly renderLoading?: () => JSX.Element;
    readonly onChange?: (nextPieces: PuzzlePieces, nextHidden: number | null) => void;
};
export default function PicturePuzzle({ style, size, pieces, source, hidden, renderLoading, onChange, }: PicturePuzzleProps): JSX.Element;
