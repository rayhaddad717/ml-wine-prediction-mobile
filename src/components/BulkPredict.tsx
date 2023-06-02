import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {COLORS} from '../constants/styles';
import {AxiosError} from 'axios';
import {Button, Divider, HStack} from 'native-base';
import AlertUtil from '../utils/AlertUtil';
import {API} from '../utils/API';
const BulkPredict = () => {
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [isLoading, setLoading] = useState(false);
  const [qualities, setQualities] = useState<
    {name: string; quality: number}[] | null
  >(null);
  const [error, setError] = useState<null | string>(null);

  const reset = () => {
    setQualities(null);
  };
  const handleSubmit = async () => {
    reset();
    setLoading(true);
    if (fileResponse != null) {
      // If file selected then create FormData
      const fileToUpload = fileResponse[0];
      const formData = new FormData();
      formData.append('csv_file', fileToUpload);
      try {
        // let res = await axios({
        //   method: 'post',
        //   url: 'http://192.168.1.109:5000/api/wine/bulk_predict',
        //   data: image,
        //   headers: {'Content-Type': 'multipart/form-data'},
        //   timeout: 1000,
        // });
        let res = await API.post('/wine/bulk_predict', formData);
        if (res.status == 200) {
          setQualities(res.data.predictions);
        } else {
          // If no file selected the show alert
          setError('Please Select File first');
        }
      } catch (err: any) {
        const error: AxiosError = err;
        console.log(error.response?.data);
        // setPrediction(getErrors(error.response?.data as any));
        if (error.code == 'ECONNABORTED') {
          setError('No Internet Connection');
        }
      }
    }
    setLoading(false);
  };
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        // type: DocumentPicker.types.xlsx,
        allowMultiSelection: false,
      });
      setFileResponse(response);
      reset();
    } catch (err) {
      console.warn(err);
    }
  }, []);
  return (
    <View style={styles.container}>
      <HStack alignItems="center" mb={5}>
        <Text style={styles.title}>File:</Text>
        <Divider
          ml={5}
          width="85%"
          _light={{
            bg: COLORS.PRIMARY_BLUE,
          }}
        />
      </HStack>
      {!fileResponse.length ? (
        <Text>Please upload a CSV File</Text>
      ) : (
        <Text>File selected : {fileResponse[0].name}</Text>
      )}

      <HStack alignItems="center" mt={5}>
        <Text style={styles.title}>Predictions:</Text>
        <Divider
          ml={5}
          width="70%"
          _light={{
            bg: COLORS.PRIMARY_BLUE,
          }}
        />
      </HStack>
      {error && (
        <AlertUtil message={error} title="Error" close={() => setError(null)} />
      )}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY_BLUE}
          style={{marginTop: 10}}
        />
      )}
      {qualities && qualities.length > 0 && (
        <View
          style={{
            ...styles.predictionItem,
            paddingHorizontal: 20,
            marginTop: 30,
          }}>
          <Text style={{color: COLORS.PRIMARY_BLUE, fontWeight: '600'}}>
            Name
          </Text>
          <Text style={{color: COLORS.PRIMARY_BLUE, fontWeight: '600'}}>
            Quality
          </Text>
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.predictionContainer}>
          {!isLoading && (
            <FlatList
              data={qualities}
              keyExtractor={(item, index) => `pred-${index}`}
              renderItem={({item}) => (
                <View style={styles.predictionItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.quality}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button mt="5" colorScheme="cyan" onPress={handleDocumentSelection}>
          Select 📑
        </Button>

        <Button mt="5" colorScheme="cyan" onPress={handleSubmit}>
          Predict
        </Button>
      </View>
    </View>
  );
};
export default BulkPredict;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 0,
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
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
    // flex: 1,
  },
  predictionContainer: {
    // alignItems: 'center',
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
