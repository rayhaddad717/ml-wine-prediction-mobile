import {
  VStack,
  FormControl,
  Input,
  Divider,
  Button,
  Heading,
  HStack,
} from 'native-base';
import React from 'react';
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useState, useRef} from 'react';
import axios from 'axios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useScrollToTop} from '@react-navigation/native';
import {COLORS} from '../constants/styles';
import AlertUtil from '../utils/AlertUtil';
type field_names = {
  field_name:
    | 'fixedAcidity'
    | 'volatileAcidity'
    | 'citricAcid'
    | 'residualSugar'
    | 'chlorides'
    | 'freeSulfurDioxide'
    | 'density'
    | 'pH'
    | 'sulphates'
    | 'alcohol';
  label: string;
};
const input_keys: field_names[] = [
  {field_name: 'fixedAcidity', label: 'Fixed Acidity'},
  {field_name: 'volatileAcidity', label: 'Volatile Acidity'},
  {field_name: 'citricAcid', label: 'Citric Acid'},
  {field_name: 'residualSugar', label: 'Residual Sugar'},
  {field_name: 'chlorides', label: 'Chlorides'},
  {field_name: 'freeSulfurDioxide', label: 'Free Sulfer Dioxide'},
  {field_name: 'density', label: 'Density'},
  {field_name: 'pH', label: 'pH'},
  {field_name: 'sulphates', label: 'Suphates'},
  {field_name: 'alcohol', label: 'Alcohol'},
];
interface IWineSample {
  fixedAcidity: number;
  volatileAcidity: number;
  citricAcid: number;
  residualSugar: number;
  chlorides: number;
  freeSulfurDioxide: number;
  density: number;
  pH: number;
  sulphates: number;
  alcohol: number;
}
interface APIResponse {
  success: boolean;
  error: object | null;
  prediction: number;
}
export default function WinePredict() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: 100,
    width: '100%',
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      fixedAcidity: 7.5,
      volatileAcidity: 0.3,
      citricAcid: 0.45,
      residualSugar: 2.0,
      chlorides: 0.08,
      freeSulfurDioxide: 18.0,
      density: 0.9966,
      pH: 3.2,
      sulphates: 0.6,
      alcohol: 10.0,
    },
  });
  const ref = useRef<null | ScrollView>(null);

  useScrollToTop(ref);
  const onSubmit = async (data: IWineSample) => {
    setIsLoading(true);
    axios
      .post<APIResponse>(
        'http://192.168.1.109:5000/api/wine/predict',
        {
          // .post<APIResponse>('http://10.0.2.2:5000/api/wine/predict', {
          form: data,
        },
        {timeout: 1000},
      )
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          setPrediction(res.data.prediction === 1 ? 'Good' : 'Bad');
        } else {
          setError('An error has occured.');
        }
      })
      .catch(error => {
        setIsLoading(false);
        if (error.code === 'ECONNABORTED') {
          setError('No internet connection');
        } else {
          console.log({...error});
          setError('An error has occured.');
        }
        setPrediction(null);
      });
  };
  const resetForm = () => {
    reset();
    setPrediction(null);
  };
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  return (
    <ScrollView
      ref={ref}
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <VStack
        justifyContent="center"
        width="100%"
        paddingX={10}
        pb={10}
        backgroundColor={'white'}>
        {error ? (
          <AlertUtil
            message={error}
            title="Error"
            close={() => setError(null)}
          />
        ) : (
          <>
            <HStack alignItems="center" mt={5} mb={15}>
              <Heading color={COLORS.PRIMARY_BLUE} size="sm">
                Wine Chemical Components
              </Heading>

              <Divider
                ml={5}
                width="20%"
                _light={{
                  bg: COLORS.PRIMARY_BLUE,
                }}
              />
            </HStack>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color={COLORS.PRIMARY_BLUE}
                style={{marginTop: 10}}
              />
            )}
            {!isLoading &&
              !prediction &&
              input_keys.map((_field, index) => (
                <Controller
                  key={index}
                  control={control}
                  rules={{
                    required: true,
                    min: 0,
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <FormControl
                        isRequired
                        isInvalid={_field.field_name in errors}>
                        <FormControl.Label
                          _text={{
                            bold: true,
                          }}>
                          {_field.label}
                        </FormControl.Label>
                        <Input
                          value={`${value}`}
                          keyboardType="numeric"
                          placeholder={_field.label}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />

                        {errors[_field.field_name] ? (
                          <FormControl.ErrorMessage
                            _text={{
                              fontSize: 'xs',
                            }}>
                            This is required
                          </FormControl.ErrorMessage>
                        ) : (
                          <FormControl.HelperText
                            _text={{
                              fontSize: 'xs',
                              textAlign: 'right',
                            }}>
                            {_field.label + ' must be positive'}
                          </FormControl.HelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                  name={_field.field_name}
                />
              ))}
            {prediction && (
              <View style={{flexDirection: 'row', gap: 5, marginVertical: 20}}>
                <Text>Your Wine is</Text>
                <Text style={{color: COLORS.PRIMARY_BLUE, fontWeight: '600'}}>
                  {prediction}
                </Text>
              </View>
            )}

            <View>
              {!prediction && (
                <Button
                  onPress={handleSubmit(onSubmit)}
                  mt="5"
                  colorScheme="cyan">
                  {isLoading ? 'Predicting...' : 'Predict'}
                </Button>
              )}

              <Button onPress={resetForm} mt="5" colorScheme="cyan">
                Reset
              </Button>
            </View>
          </>
        )}
      </VStack>
    </ScrollView>
  );
}
