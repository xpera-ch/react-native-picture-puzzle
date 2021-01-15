import * as React from 'react';
import {
  Platform,
  Image,
  Animated,
  StyleSheet,
  ImageProps,
  ImageURISource,
  View,
 } from 'react-native';

import ObscureView from './ObscureView';
import { PuzzlePieces } from '../types';
import { throwOnInvalidPuzzlePieces, shouldDoubleBuffer } from '../constants';

// Used to describe animations using the length of the row as a metric.
const BASELINE_ROW_LENGTH = 3;

export type PicturePuzzleProps = ImageProps & {
  readonly hidden: number;
  readonly size: number;
  readonly pieces: PuzzlePieces;
  readonly source: ImageURISource | number;
  readonly renderLoading?: () => JSX.Element;
};

const styles = StyleSheet.create({
  absolute: {position: 'absolute'},
  invisible: {opacity: 0},
  fullWidth: {width: '100%'},
  noOverflow: {overflow: 'hidden'},
  row: {flexDirection: 'row'},
});

// TODO: add loading indicator :D, make sick as hell
export default function PicturePuzzle({
  style,
  size,
  pieces,
  source,
  hidden,
  renderLoading,
}: PicturePuzzleProps): JSX.Element {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!!source && typeof source === 'object') {
      const { uri } = source as ImageURISource;
      if (typeof uri === 'string' && !!uri.length) {
        Image.prefetch(uri);
      }
    }
  }, [source]);
  React.useEffect(() => {
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
      throw new Error(`[PicturePuzzle]: Expected positive integer size, encountered ${size}.`);
    }
  }), [size];
  React.useEffect(() => throwOnInvalidPuzzlePieces(pieces), [pieces]);

  const piecesPerRow = React.useMemo((): number => Math.sqrt(pieces.length), [size])

  const pieceSize = React.useMemo((): number => (
    size / piecesPerRow
  ), [size, piecesPerRow]);

  const consecutivePuzzlePieces = React.useMemo((): readonly React.ElementType[][] => {
    return [...Array(piecesPerRow)].map((_, i) => (
      [...Array(piecesPerRow)].map((_, j) => (
        /* <ObscuredPiece /> */
        (props) => {
          const top = -i * pieceSize;
          const bottom = (-i * pieceSize) + pieceSize;
          const left = -j * pieceSize;
          const right = (-j * pieceSize) + pieceSize;
          return (
            <ObscureView {...props} top={top} bottom={bottom} left={left} right={right}>
              <Image style={{width: size, height: size}} source={source} />
            </ObscureView>
          );
        }
      ))
    ))
  }, [size, source, piecesPerRow]);

  const consecutivePieceOpacities = React.useMemo(() => ( /* new on pieces delta */
    [...Array(pieces.length)].map(() => new Animated.Value(0))
  ), [pieces.length]);

  const consecutivePieceTranslations = React.useMemo(() => ( /* new on pieces delta */
    [...Array(pieces.length)].map(() => new Animated.ValueXY({
      x: 0,
      y: 0,
    }))
  ), [pieces.length]);

  const calculatePieceOffset = React.useCallback((pieceNumber: number): {
    readonly x: number;
    readonly y: number;
  } => { /* look at supplied array and compute required delta */
    const i = pieces.indexOf(pieceNumber);
    const x = (i % piecesPerRow) * pieceSize;
    const y = Math.floor(i / piecesPerRow) * pieceSize;
    return {x, y};
  }, [pieces, piecesPerRow]);

  React.useEffect(() => {
    consecutivePieceTranslations.map((consecutivePieceTranslation, i) => {
      consecutivePieceTranslation.setValue(calculatePieceOffset(i));
    });
  }, [pieces, calculatePieceOffset, consecutivePieceTranslations]);

  const shouldGlobalAnimate = React.useCallback(() => {
    Animated.stagger(50 * (BASELINE_ROW_LENGTH / piecesPerRow), consecutivePieceOpacities.map(
      (consecutivePieceOpacity, i) => Animated.spring(consecutivePieceOpacity, {
        toValue: i === hidden ? 0 : 1,
        friction: 9,
        overshootClamping: true,
        useNativeDriver: Platform.OS !== 'web',
      }),
    )).start()
  }, [piecesPerRow, consecutivePieceOpacities, hidden]);

  React.useEffect(() => { /* validate */
    if (pieces.indexOf(hidden) < 0) {
      throw new Error(`[PicturePuzzle]: Expected hidden to resolve to a valid piece, but encountered ${hidden}.`);
    }
    // TODO: Useful for testing.
    //!!loaded && shouldGlobalAnimate();
  }, [hidden, pieces, loaded]);

  const onLoad = React.useCallback(() => {
    setTimeout(
      () => shouldDoubleBuffer(
        () => setLoaded(true),
        shouldGlobalAnimate,
      ),
      10,
    );
  }, [setLoaded, shouldGlobalAnimate]);
  
  const animLoadOpacity = React.useMemo(() => new Animated.Value(1), []);

  React.useEffect(() => {
    Animated.timing(animLoadOpacity, {
      toValue: loaded ? 0 : 1,
      useNativeDriver: Platform.OS !== 'web',
      duration: (piecesPerRow / BASELINE_ROW_LENGTH) * 250,
    }).start();
  }, [animLoadOpacity, loaded]);

  return (
    <Animated.View
      style={[
        StyleSheet.flatten(style),
        styles.noOverflow,
        {width: size, height: size},
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        {!loaded && (
          <Image
            style={[
              {width: size, height: size },
              styles.absolute,
              styles.invisible,
            ]}
            source={source}
            onLoad={onLoad}
          />
        )}
        <Animated.View style={[StyleSheet.absoluteFill, {opacity: animLoadOpacity}]}>
          {typeof renderLoading === 'function' && renderLoading()}
        </Animated.View>
        {!!loaded && consecutivePuzzlePieces.map(([...rowPieces], i) => (
          <View style={[styles.row, styles.fullWidth]} key={`k${i}`}>
            {rowPieces.map((ObscuredPiece, j) => {
              const idx = i * piecesPerRow + j;
              const opacity = consecutivePieceOpacities[idx];
              const translate = consecutivePieceTranslations[idx];
              return (
                <ObscuredPiece
                  key={`k${j}`}
                  style={{
                    opacity,
                    // test
                    position: 'absolute',
                    left: translate.x,
                    top: translate.y,

                    transform: [
                      {scaleX: opacity},
                      {scaleY: opacity},
                      //{translateX: translate.x},
                      //{translateY: translate.y},
                    ],
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}