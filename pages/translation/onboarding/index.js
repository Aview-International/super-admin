import Image from 'next/image';
import DashboardLayout from '../../../components/dashboard/DashboardLayoutNoSidebar';
import FormInput from '../../../components/FormComponents/FormInput';
import CustomSelectInput from '../../../components/FormComponents/CustomSelectInput';
import Button from '../../../components/UI/Button';
import Blobs from '../../../components/UI/blobs'
import React, {useState, useEffect} from 'react';
import ErrorHandler from '../../../utils/errorHandler';
import SuccessHandler from '../../../utils/successHandler';
import { getSupportedLanguages, getCountriesAndCodes, createTranslator, sendSupportMessage } from '../../../services/apis'; 
import FullScreenLoader from '../../../public/loaders/FullScreenLoader';
import CheckBox from '../../../components/FormComponents/CheckBox';
import Popup from '../../../components/UI/Popup';
import messages from '../../../public/img/icons/messages.svg';
import Textarea from '../../../components/FormComponents/Textarea';


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
    const [popupSupport, setPopupSupport] = useState(false);
    const [popupSubmit, setPopupSubmit] = useState(false);
    const [supportEmail, setSupportEmail] = useState('');
    const [supportInquiry, setSupportInquiry] = useState('')

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
            } else if (nativeLanguage=="Select"){
                throw new Error('Please select native language');
            } else if (country=="Select"){
                throw new Error('Please select country');
            }else if (!checkedState){
                throw new Error('Please select payment method');
            }else if (!((checkedState=='xoom' && xoom) || (checkedState=='remitly' && remitly) || (checkedState=='paypal' && paypal))){
                throw new Error('Please enter payment details');
            }else{
                try{
                    await createTranslator(name, email, nativeLanguage, country, checkedState, paymentDetails)
                    setPopupSubmit(true);
                } catch (error) {
                    ErrorHandler(error);
                }

                setLoader('');
            }
        }catch(error){
            ErrorHandler(error);
            setLoader('');
        }
    }

    const handleSupport = async () => {
        setLoader('support');

        try{
            if (!supportEmail){
                throw new Error('Please enter email');
            } else if (!verifyEmail(supportEmail)) {
                throw new Error('Please enter a valid email');
            } else if (!supportInquiry){
                throw new Error('Please enter inquiry');
            }else{
                try{
                    await sendSupportMessage(supportEmail, supportInquiry)
                    SuccessHandler("sent!")
                    setPopupSupport(false);
                } catch (error) {
                    ErrorHandler(error);
                }

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
                    <Popup show={popupSubmit} onClose={() => setPopupSubmit(false)}>
                    <div className="w-full h-full">
                            <div className="w-[500px] bg-indigo-2 rounded-2xl p-s3">
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="text-white text-2xl mb-s2">Success!</h2>
                                    <p className="text-white">You'll be notified via email when there is a new translation to be reviewed, thank you.</p>


                                </div>
                                

                            </div>
                    </div>
                    </Popup>
                    <Popup show={popupSupport} onClose={() => setPopupSupport(false)}>
                        <div className="w-full h-full">
                            <div className="w-[600px] bg-indigo-2 rounded-2xl p-s2">
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="text-white text-2xl mb-s4">Contact Support</h2>

                                    <FormInput
                                        label="Email"
                                        value={supportEmail}
                                        placeholder="Your email"
                                        onChange={(e) => setSupportEmail(e.target.value)}
                                        name="title"
                                        labelClasses="text-lg text-white !mb-[4px]"
                                        valueClasses="placeholder-white text-lg font-light"
                                        classes="!mb-s4"
                                    />
                                    <h2 className="text-white text-lg w-full">Support Message</h2>
                                    <Textarea
                                        placeholder="Your inquiry"
                                        classes="!mb-s2"
                                        textAreaClasses="text-lg text-white placeholder-white font-light"
                                        onChange={(e) => setSupportInquiry(e.target.value)}
                                    />
                                    <div className="w-full">
                                        <div className="w-[134px] h-[47px] float-right">
                                            <Button
                                                theme="light"
                                                onClick={() => handleSupport()}
                                                isLoading={loader ==='support'}
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </Popup>
                    <div className="mt-s2 float-right mr-[100px] cursor-pointer">
                        <a className="relative flex items-center rounded-full bg-white-transparent px-s2 py-2.5 text-sm" onClick={() => setPopupSupport(true)}>
                            <span className="mr-s1.5 grid place-content-center brightness-0 invert">
                            <Image src={messages} alt="Messages" />
                            </span>
                            <span className="mt-0.5 text-white">Support</span>
                        </a>
                    </div>
                    <div className="w-full max-w-[768px] mx-auto px-4 sm:px-6 lg:px-8 max-h-screen mt-s5 mb-[200px]">
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
                        

                        <div className="my-s2 w-[134px] h-[47px] float-right">
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
