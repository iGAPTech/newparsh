import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions,PanResponder,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

import PropTypes from "prop-types";

function calcDistance(x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function calcCenter(x1, y1, x2, y2) {
  function middle(p1, p2) {
    return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
  }

  return {
    x: middle(x1, x2),
    y: middle(y1, y2)
  };
}

function maxOffset(offset, windowDimension, imageDimension) {
  const max = windowDimension - imageDimension;
  if (max >= 0) {
    return 0;
  }
  return offset < max ? max : offset;
}

function calcOffsetByZoom(width, height, imageWidth, imageHeight, zoom) {
  const xDiff = imageWidth * zoom - width;
  const yDiff = imageHeight * zoom - height;
  return {
    left: -xDiff / 2,
    top: -yDiff / 2
  };
}

const ZoomableImage = ({ imageWidth, imageHeight, source, style }) => {
  const [zoomState, setZoomState] = useState({
    zoom: null,
    minZoom: null,
    layoutKnown: false,
    isZooming: false,
    isMoving: false,
    initialDistance: null,
    initialX: null,
    initialY: null,
    offsetTop: 0,
    offsetLeft: 0,
    initialTop: 0,
    initialLeft: 0,
    initialTopWithoutZoom: 0,
    initialLeftWithoutZoom: 0,
    initialZoom: 1,
    top: 0,
    left: 0,
    width: null,
    height: null
  });

  const _onLayout = event => {
    const layout = event.nativeEvent.layout;

    if (
      layout.width === zoomState.width &&
      layout.height === zoomState.height
    ) {
      return;
    }

    const zoom = layout.width / imageWidth;

    const offsetTop =
      layout.height > imageHeight * zoom
        ? (layout.height - imageHeight * zoom) / 2
        : 0;

    setZoomState(prevState => ({
      ...prevState,
      layoutKnown: true,
      width: layout.width,
      height: layout.height,
      zoom,
      offsetTop,
      minZoom: zoom
    }));
  };

  const processPinch = (x1, y1, x2, y2) => {
    const distance = calcDistance(x1, y1, x2, y2);
    const center = calcCenter(x1, y1, x2, y2);

    if (!zoomState.isZooming) {
      const offsetByZoom = calcOffsetByZoom(
        zoomState.width,
        zoomState.height,
        imageWidth,
        imageHeight,
        zoomState.zoom
      );
      setZoomState(prevState => ({
        ...prevState,
        isZooming: true,
        initialDistance: distance,
        initialX: center.x,
        initialY: center.y,
        initialTop: zoomState.top,
        initialLeft: zoomState.left,
        initialZoom: zoomState.zoom,
        initialTopWithoutZoom: zoomState.top - offsetByZoom.top,
        initialLeftWithoutZoom: zoomState.left - offsetByZoom.left
      }));
    } else {
      const touchZoom = distance / zoomState.initialDistance;
      const zoom =
        touchZoom * zoomState.initialZoom > zoomState.minZoom
          ? touchZoom * zoomState.initialZoom
          : zoomState.minZoom;

      const offsetByZoom = calcOffsetByZoom(
        zoomState.width,
        zoomState.height,
        imageWidth,
        imageHeight,
        zoom
      );
      const left =
        zoomState.initialLeftWithoutZoom * touchZoom + offsetByZoom.left;
      const top =
        zoomState.initialTopWithoutZoom * touchZoom + offsetByZoom.top;

      setZoomState(prevState => ({
        ...prevState,
        zoom,
        left:
          left > 0
            ? 0
            : maxOffset(left, zoomState.width, imageWidth * zoom),
        top:
          top > 0
            ? 0
            : maxOffset(top, zoomState.height, imageHeight * zoom)
      }));
    }
  };

  const processTouch = (x, y) => {
    if (!zoomState.isMoving) {
      setZoomState(prevState => ({
        ...prevState,
        isMoving: true,
        initialX: x,
        initialY: y,
        initialTop: zoomState.top,
        initialLeft: zoomState.left
      }));
    } else {
      const left = zoomState.initialLeft + x - zoomState.initialX;
      const top = zoomState.initialTop + y - zoomState.initialY;

      setZoomState(prevState => ({
        ...prevState,
        left:
          left > 0
            ? 0
            : maxOffset(left, zoomState.width, imageWidth * zoomState.zoom),
        top:
          top > 0
            ? 0
            : maxOffset(top, zoomState.height, imageHeight * zoomState.zoom)
      }));
    }
  };

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: evt => {
      const touches = evt.nativeEvent.touches;
      if (touches.length === 2) {
        processPinch(
          touches[0].pageX,
          touches[0].pageY,
          touches[1].pageX,
          touches[1].pageY
        );
      } else if (touches.length === 1 && !zoomState.isZooming) {
        processTouch(touches[0].pageX, touches[0].pageY);
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => {
      setZoomState(prevState => ({
        ...prevState,
        isZooming: false,
        isMoving: false
      }));
    },
    onPanResponderTerminate: () => {},
    onShouldBlockNativeResponder: () => true
  });

  return (
    <View style={style} {..._panResponder.panHandlers} onLayout={_onLayout}>
      <Image
        style={{
          position: "absolute",
          top: zoomState.offsetTop + zoomState.top,
          left: zoomState.offsetLeft + zoomState.left,
          width: imageWidth * zoomState.zoom,
          height: imageHeight * zoomState.zoom
        }}
        source={source}
      />
    </View>
  );
};

ZoomableImage.propTypes = {
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  source: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function PrintQuotationScreen({navigation,route}) {
    const [filename, setFilename] = useState('');
    const [imageLead, setImageLead] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const fetchedFilename = await route.params.filename; 
            if (fetchedFilename) {
                setFilename(fetchedFilename);
            }
        };
        fetchData();
    }, [route.params.filename]); 

    useEffect(() => {
        if (filename) {
            const imgurl = apiUrl + 'quotations/' + filename; 
            setImageLead(imgurl);
        }
    }, [filename]); // Update image URL when filename changes

    console.log("imageLead", imageLead);
  const imageWidth = 100; // Example width
  const imageHeight = 100; // Example height

  const handleDownload = async () => {
    if (!imageLead) {
        Alert.alert('No image available to download');
        return;
    }

    try {
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        const downloadedFile = await FileSystem.downloadAsync(imageLead, fileUri);
        if (downloadedFile && downloadedFile.status === 200) {
            Alert.alert('Download complete', 'Image downloaded successfully');
        } else {
            Alert.alert('Download failed', 'Failed to download image');
        }
    } catch (error) {
        console.error('Error downloading image:', error);
        Alert.alert('Error', 'Failed to download image');
    }
};


    return (
        <View style={styles.container}>
            {imageLead ? (
                // <Image
                //     source={{ uri: imageLead }}
                //     style={styles.image}
                //     resizeMode="contain" // Maintain aspect ratio while fitting the image within its container
                //     onError={() => console.log("Error loading image")}
                // />
                <ZoomableImage
                source={{ uri: imageLead }}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                style={styles.zoomableImageContainer} // Apply styles here
              />
              
            ) : (
                <Text style={styles.noImageText}>No image available</Text>
            )}
             <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                <Feather name="download" size={24} color="black" />
            </TouchableOpacity>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fda90120',
    },
    image: {
      width: 300,
      height: 300,
    },
    noImageText: {
      fontSize: 16,
      color: 'red',
    },
    zoomableImageContainer: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
    //   backgroundColor: '#000', 
      height:400,
      width:400
    },
    downloadButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 10,
        elevation: 5,
    },
  });
  
