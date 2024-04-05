import Image from 'next/image';
import FormInput from '../../components/FormComponents/FormInput';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import Button from '../../components/UI/Button';
import React, { useState, useEffect, useSelector } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import {
  getSupportedLanguages,
  getCountriesAndCodes,
} from '../../services/apis';
import CheckBox from '../../components/FormComponents/CheckBox';
import Popup from '../../components/UI/PopupNormal';
import MultipleSelectInput from '../../components/FormComponents/MultipleSelectInput';


const ReviewerSettingsPopup = ({show, onClose}) =>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState([]);
    const [country, setCountry] = useState('Select');
    const [paypal, setPaypal] = useState('');
    const [xoom, setXoom] = useState('');
    const [remitly, setRemitly] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [countriesAndCodes, setCountriesAndCodes] = useState([]);
    const [checkedState, setCheckedState] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [loader, setLoader] = useState('');


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

    setIsLoading(false);
    };

    const handleMultipleLanguages = (option) => {
    const allLanguages = [...nativeLanguage];
    if (allLanguages.includes(option))
        allLanguages.splice(allLanguages.indexOf(option), 1);
    else allLanguages.push(option);
    setNativeLanguage(allLanguages);
    };

    useEffect(() => {
    getLanguagesAndCountries();
    }, []);

    return (
        <>
        <Popup show={show} onClose={onClose}>
        <div className="mx-auto max-h-screen w-full max-w-[768px] min-w-[768px] px-4 sm:px-6 lg:px-8">
            <div className="text-4xl font-normal text-left text-white mb-s2">
              Settings
            </div>
            <div className="w-full h-full bg-indigo-1 px-s4 pt-s4 pb-s14 rounded-2xl">
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
                  
                  isLoading={loader === 'submit'}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>


        </Popup>
        </>
    )
}

export default ReviewerSettingsPopup;