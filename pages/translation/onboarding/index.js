
import DashboardLayout from '../../../components/dashboard/DashboardLayoutNoSidebar';
import FormInput from '../../../components/FormComponents/FormInput';
import CustomSelectInput from '../../../components/FormComponents/CustomSelectInput';
import Button from '../../../components/UI/Button';
import Blobs from '../../../components/UI/blobs'
import React, {useState, useEffect} from 'react';
import ErrorHandler from '../../../utils/errorHandler';
import { getSupportedLanguages, getCountriesAndCodes, createTranslator } from '../../../services/apis'; 
import FullScreenLoader from '../../../public/loaders/FullScreenLoader';
import CheckBox from '../../../components/FormComponents/CheckBox';


const Onboarding = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('Select'); 
    const [country, setCountry] = useState('Select'); 
    const [paypal, setPaypal] = useState('');
    const [xoom, setXoom] = useState('');
    const [remitly, setRemitly] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [countriesAndCodes, setCountriesAndCodes] = useState([]);
    const [checkedState, setCheckedState] = useState('')
    const [paymentDetails, setPaymentDetails] = useState('');
    const [loader, setLoader] = useState('');

    const handleCheckBox = (name) => {
        setCheckedState(name);
    };

    const handleSubmit = async () => {
        setLoader('submit');
        try{
            if (!name){
                throw new Error('Please enter name');
            } else if (!email){
                throw new Error('Please enter email');
            } else if (!verifyEmail(email)) {
                throw new Error('Please enter a valid email');
            } else if (!nativeLanguage){
                throw new Error('Please select native language');
            } else if (!country){
                throw new Error('Please select country');
            }else if (!checkedState){
                throw new Error('Please select payment method');
            }else if (!((checkedState=='xoom' && xoom) || (checkedState=='remitly' && remitly) || (checkedState=='paypal' && paypal))){
                throw new Error('Please enter payment details');
            }else{
                await createTranslator(name, email, nativeLanguage, country, checkedState, paymentDetails)
                setLoader('');
            }
        }catch(error){
            ErrorHandler(error);
            setLoader('');
        }
    }


    const verifyEmail = (email) => {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
            
    }

    const getLanguagesAndCountries = async () => {
        await getSupportedLanguages().then((res) => {
            setSupportedLanguages((res.map(item => item.languageName)).sort());
        });

        await getCountriesAndCodes().then((res) => {
            setCountriesAndCodes((res.map(item => item.name)).sort());
        });

        setIsLoading(false);
    }

    useEffect(() => {
        
        
        getLanguagesAndCountries()


    }, []);


    return (
        <>
            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <>
                    <div className="min-w-[768px] w-full max-w-[768px] mx-auto px-4 sm:px-6 lg:px-8 max-h-screen mt-s5 mb-[200px]">
                    <div className="text-white text-6xl font-bold">Become a translator</div>
                    <div className="text-white text-lg mt-s2 font-normal">Sign up today to become a translator and manage content.</div>
                    <div className="text-white text-4xl font-bold mt-s5">Personal Information</div>

                    <FormInput
                        label="Name"
                        placeholder="First and last Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}      
                        name="title"
                        labelClasses="text-lg text-white mt-s2 !mb-[4px]"
                        valueClasses="placeholder-white text-lg font-light"
                        classes="!mb-s2"
                    />

                    <FormInput
                        label="Email"
                        value={email}
                        placeholder="Your email"
                        onChange={(e) => setEmail(e.target.value)}
                        name="title"
                        labelClasses="text-lg text-white !mb-[4px]"
                        valueClasses="placeholder-white text-lg font-light"
                        classes="!mb-s2"
                    />


                    <CustomSelectInput
                        text="Native Language"
                        name="playlists"
                        value={nativeLanguage}
                        options={supportedLanguages}
                        onChange={(selectedOption) => setNativeLanguage(selectedOption)}
                        labelClasses="text-lg text-white !mb-[4px]"
                        valueClasses="text-lg font-normal !text-white ml-s1 font-light"
                        classes="!mb-s2"
                    />
                        

                    <CustomSelectInput
                        text="Country"
                        name="playlists"
                        value={country}
                        options={countriesAndCodes}
                        onChange={(selectedOption) => setCountry(selectedOption)}
                        labelClasses="text-lg text-white !mb-[4px]"
                        valueClasses="text-lg font-normal !text-white ml-s1 font-light"
                    />

                    <div className="text-white text-4xl font-bold mt-s5">Payment method</div>

                    <div className="mt-s2">
                        <CheckBox
                            label="Paypal"
                            onChange={() => handleCheckBox('paypal')}
                            name="checkbox"
                            labelClasses="text-xl mt-[3px]"
                            isChecked={checkedState==='paypal'}
                        />
                    </div>
                    {checkedState=='paypal' ? (
                        <FormInput
                            value={paypal}
                            placeholder="Name, username, email"
                            onChange={(e) => {setPaypal(e.target.value);setPaymentDetails(e.target.value)}}
                            labelClasses="text-lg text-white mt-s2"
                            valueClasses="placeholder-white text-lg font-light"
                            classes="!mb-s2"
                        />
                        ):(<></>)
                    }
                    
                    <div className="mt-s1">
                        <CheckBox
                            label="Xoom"
                            onChange={() => handleCheckBox('xoom')}
                            name="checkbox"
                            labelClasses="text-xl mt-[5px]"
                            isChecked={checkedState==='xoom'}
                        />
                    </div>

                    {checkedState==='xoom'? (
                        <FormInput
                            value={xoom}
                            placeholder="Name, username, email"
                            onChange={(e) => {setXoom(e.target.value);setPaymentDetails(e.target.value)}}
                            labelClasses="text-lg text-white mt-s2"
                            valueClasses="placeholder-white text-lg font-light"
                            classes="!mb-s2"
                        />
                        ):(<></>)
                    }

                    <div className="mt-s1">
                        <CheckBox
                            label="Remitly"
                            onChange={() => handleCheckBox('remitly')}
                            name="checkbox"
                            labelClasses="text-xl mt-[5px]"
                            isChecked={checkedState==='remitly'}
                        />
                    </div>
                    
                    {checkedState==='remitly'? (
                        <FormInput
                            value={remitly}
                            placeholder="Name, username, email"
                            onChange={(e) => {setRemitly(e.target.value);setPaymentDetails(e.target.value)}}
                            labelClasses="text-lg text-white mt-s2"
                            valueClasses="placeholder-white text-lg font-light"
                            classes="!mb-s2"
                        />
                        ):(<></>)
                    }
                    

                    <div className="mt-s2 w-[134px] h-[47px] float-right">
                        <Button
                                theme="light"
                                onClick={() => handleSubmit()}
                                isLoading={loader ==='submit'}
                                
                                
                        >
                            Submit
                        </Button>
                    </div>

                    

                    
                    
                </div>
                <Blobs/>
            </>
            )}
            

      
        </>
    )
};

Onboarding.getLayout = DashboardLayout;

export default Onboarding;
