import FormInput from '../../components/FormComponents/FormInput';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import Button from '../../components/UI/Button';
import { useState, useEffect } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import {
  getSupportedLanguages,
  getCountriesAndCodes,
  updateTranslator,
} from '../../services/apis';
import CheckBox from '../../components/FormComponents/CheckBox';
import Popup from '../../components/UI/PopupNormal';
import MultipleSelectInput from '../../components/FormComponents/MultipleSelectInput';

const ReviewerSettingsPopup = ({ show, onClose, translator }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState([]);
  const [country, setCountry] = useState('Select');
  const [paypal, setPaypal] = useState('');
  const [xoom, setXoom] = useState('');
  const [remitly, setRemitly] = useState('');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [countriesAndCodes, setCountriesAndCodes] = useState([]);
  const [checkedState, setCheckedState] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [loader, setLoader] = useState('');

  const handleCheckBox = (name) => {
    setCheckedState(name);
  };

  const verifyEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getLanguagesAndCountries = async () => {
    await getSupportedLanguages().then((res) => {
      setSupportedLanguages(res.map((item) => item.languageName).sort());
    });

    await getCountriesAndCodes().then((res) => {
      setCountriesAndCodes(res.map((item) => item.name).sort());
    });
  };

  const handleMultipleLanguages = (option) => {
    const allLanguages = [...nativeLanguage];
    if (allLanguages.includes(option))
      allLanguages.splice(allLanguages.indexOf(option), 1);
    else allLanguages.push(option);
    setNativeLanguage(allLanguages);
  };

  const handleUpdate = async () => {
    setLoader('update');
    try {
      if (!name) {
        throw new Error('Please enter name');
      } else if (!email) {
        throw new Error('Please enter email');
      } else if (!verifyEmail(email)) {
        throw new Error('Please enter a valid email');
      } else if (nativeLanguage.length === 0) {
        throw new Error('Please select native language');
      } else if (country === 'Select') {
        throw new Error('Please select country');
      } else if (!checkedState) {
        throw new Error('Please select payment method');
      } else if (
        !(
          (checkedState === 'xoom' && xoom) ||
          (checkedState === 'remitly' && remitly) ||
          (checkedState === 'paypal' && paypal)
        )
      ) {
        throw new Error('Please enter payment details');
      } else {
        try {
          await updateTranslator(
            name,
            email,
            nativeLanguage,
            country,
            checkedState,
            paymentDetails,
            translator._id
          );

          SuccessHandler('Details updated successfully');
        } catch (error) {
          ErrorHandler(error);
        }

        setLoader('');
      }
    } catch (error) {
      ErrorHandler(error);
      setLoader('');
    }
  };

  const handleSetValues = () => {
    if (translator) {
      setName(translator.name);
      setEmail(translator.email);
      setNativeLanguage(translator.nativeLanguage);
      setCountry(translator.country);
      setPaymentDetails(translator.paymentDetails);
      if (translator.paymentMethod == 'paypal') {
        setCheckedState('paypal');
        setPaypal(translator.paymentDetails);
        setPaymentDetails(translator.paymentDetails);
      } else if (translator.paymentMethod == 'remitly') {
        setCheckedState('remitly');
        setRemitly(translator.paymentDetails);
        setPaymentDetails(translator.paymentDetails);
      } else if (translator.paymentMethod == 'xoom') {
        setCheckedState('xoom');
        setXoom(translator.paymentDetails);
        setPaymentDetails(translator.paymentDetails);
      }
    }
  };

  useEffect(() => {
    getLanguagesAndCountries();
  }, []);

  useEffect(() => {
    handleSetValues();
  }, [translator]);

  return (
    <>
      <Popup show={show} onClose={onClose}>
        <div className="mx-auto max-h-screen w-full min-w-[768px] max-w-[768px] px-4 sm:px-6 lg:px-8">
          <div className="mb-s2 text-left text-4xl font-normal text-white">
            Settings
          </div>
          <div className="h-full w-full rounded-2xl bg-indigo-1 px-s4 pt-s4 pb-s14">
            <div className=" text-xl font-bold text-white">
              Personal Information
            </div>
            <FormInput
              label="Name"
              placeholder="First and last Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              labelClasses="text-lg text-white mt-s2 !mb-[4px]"
              valueClasses="text-lg font-light"
              classes="!mb-s2"
            />

            <FormInput
              label="Email"
              value={email}
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              labelClasses="text-lg text-white !mb-[4px]"
              valueClasses="text-lg font-light"
              classes="!mb-s2"
            />

            <MultipleSelectInput
              text="Native Languages"
              answer={nativeLanguage}
              options={supportedLanguages}
              onChange={(selectedOption) => {
                handleMultipleLanguages(selectedOption);
                console.log(nativeLanguage);
              }}
              labelClasses="!text-lg !text-white !mb-[4px]"
              valueClasses="!text-lg !text-white ml-s1 font-light"
              classes="!mb-s2"
              hideCheckmark={true}
            />

            <CustomSelectInput
              text="Country"
              value={country}
              options={countriesAndCodes}
              onChange={(selectedOption) => setCountry(selectedOption)}
              labelClasses="text-lg text-white !mb-[px]"
              valueClasses="text-lg !text-white ml-s1 font-light"
            />

            <div className="mt-s3 text-xl font-bold text-white">
              Payment method
            </div>

            <div className="mt-s2">
              <CheckBox
                label="Paypal"
                onChange={() => handleCheckBox('paypal')}
                name="checkbox"
                labelClasses="text-lg mt-[3px]"
                isChecked={checkedState === 'paypal'}
              />
            </div>
            {checkedState == 'paypal' && (
              <FormInput
                value={paypal}
                placeholder="Name, username, email"
                onChange={(e) => {
                  setPaypal(e.target.value);
                  setPaymentDetails(e.target.value);
                }}
                labelClasses="text-lg text-white mt-s2"
                valueClasses="text-lg font-light"
                classes="!mb-s2"
              />
            )}

            <div className="mt-s1">
              <CheckBox
                label="Xoom"
                onChange={() => handleCheckBox('xoom')}
                name="checkbox"
                labelClasses="text-lg mt-[5px]"
                isChecked={checkedState === 'xoom'}
              />
            </div>

            {checkedState === 'xoom' && (
              <FormInput
                value={xoom}
                placeholder="Name, username, email"
                onChange={(e) => {
                  setXoom(e.target.value);
                  setPaymentDetails(e.target.value);
                }}
                labelClasses="text-lg text-white mt-s2"
                valueClasses="text-lg font-light"
                classes="!mb-s2"
              />
            )}

            <div className="mt-s1">
              <CheckBox
                label="Remitly"
                onChange={() => handleCheckBox('remitly')}
                name="checkbox"
                labelClasses="text-lg mt-[5px]"
                isChecked={checkedState === 'remitly'}
              />
            </div>

            {checkedState === 'remitly' && (
              <FormInput
                value={remitly}
                placeholder="Name, username, email"
                onChange={(e) => {
                  setRemitly(e.target.value);
                  setPaymentDetails(e.target.value);
                }}
                labelClasses="text-lg text-white mt-s2"
                valueClasses="text-lg font-light"
                classes="!mb-s2"
              />
            )}

            <div className="float-right mt-s4 h-[47px] w-[134px]">
              <Button
                theme="light"
                onClick={handleUpdate}
                isLoading={loader === 'update'}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default ReviewerSettingsPopup;
