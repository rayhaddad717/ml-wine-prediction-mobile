import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  VStack,
  FormControl,
  Image,
  Center,
  Button,
  Divider,
  HStack,
} from 'native-base';

import React, {useCallback, useState} from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {COLORS} from '../constants/styles';
import axios, {AxiosError} from 'axios';
const ImagePredict = () => {
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [isLoading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const myRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (myRef.current && myRef.current.setNativeProps) {
      const styleObj = {
        borderWidth: 4,
        borderRadius: 4,
        borderColor: '#22D3EE',
      };
      myRef.current.setNativeProps({
        style: styleObj,
      });
    }
  }, [myRef]);
  const getErrors = (errors: any) => {
    let error = '';
    for (const key in errors?.errors) {
      error = error.concat(`${key},`);
    }
    return error.concat(` are missing`);
  };
  const reset = () => {
    setExtractedText(null);
    setPrediction(null);
  };
  const handleSubmit = async () => {
    reset();
    setLoading(true);
    if (fileResponse != null) {
      // If file selected then create FormData
      const fileToUpload = fileResponse[0];
      const image = new FormData();
      image.append('image', fileToUpload);
      try {
        let res = await axios({
          method: 'post',
          url: 'http://192.168.1.109:5000/api/wine/predict_from_image',
          data: image,
          headers: {'Content-Type': 'multipart/form-data'},
        });
        if (res.status == 200) {
          setExtractedText(res.data.text);
          setPrediction(res.data.prediction == 1 ? 'good' : 'bad');
        } else {
          // If no file selected the show alert
          Alert.alert('Please Select File first');
        }
      } catch (err: any) {
        const error: AxiosError = err;
        console.log(error.response?.data);
        setPrediction(getErrors(error.response?.data as any));
        if (error.code == 'ECONNABORTED') {
          Alert.alert('No Internet Connection');
        }
      }
    }
    setLoading(false);
  };
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });
      setFileResponse(response);
      reset();
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        {!fileResponse.length && <Text>Please upload an Image</Text>}
        {fileResponse.length > 0 && (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={handleDocumentSelection}
              activeOpacity={0.6}>
              <Center>
                <Image
                  resizeMode="contain"
                  ref={myRef}
                  source={{
                    uri: fileResponse[0].uri,
                  }}
                  alt="Selected Image"
                  size="xl"
                />
              </Center>
            </TouchableOpacity>
          </View>
        )}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={COLORS.PRIMARY_BLUE}
            style={{marginTop: 10}}
          />
        )}
        {prediction && (
          <View style={styles.sectionContainer}>
            <HStack alignItems="center" mt={5}>
              <Text style={styles.title}>Prediction:</Text>
              <Divider
                ml={5}
                width="70%"
                _light={{
                  bg: COLORS.PRIMARY_BLUE,
                }}
              />
            </HStack>
            <View style={{flexDirection: 'row', gap: 5, marginVertical: 20}}>
              <Text>Your Wine is</Text>
              <Text style={{color: COLORS.PRIMARY_BLUE, fontWeight: '600'}}>
                {prediction}
              </Text>
            </View>
          </View>
        )}
        {extractedText && (
          <View style={styles.sectionContainer}>
            <HStack alignItems="center" mt={5}>
              <Text style={styles.title}>Extracted Text:</Text>
              <Divider
                ml={5}
                width="60%"
                _light={{
                  bg: COLORS.PRIMARY_BLUE,
                }}
              />
            </HStack>
            <Text style={styles.content}>{extractedText}</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button onPress={handleDocumentSelection} mt="5" colorScheme="cyan">
            Select 📑
          </Button>

          <Button mt="5" colorScheme="cyan" onPress={handleSubmit}>
            Predict
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
export default ImagePredict;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  sectionContainer: {
    gap: 10,
    marginTop: 5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_BLUE,
  },
  content: {
    marginLeft: 10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  },
});
