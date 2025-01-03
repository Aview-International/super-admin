import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { createTranslator, sendSupportMessage } from '../../services/apis';
import { emailValidator } from '../../utils/regex';
import ErrorHandler from '../../utils/errorHandler';
import aviewLogo from '../../public/img/aview/logo.svg';
import messages from '../../public/img/icons/messages.svg';
import FormInput from '../../components/FormComponents/FormInput';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import Button from '../../components/UI/Button';
import Blobs from '../../components/UI/blobs';
import CheckBox from '../../components/FormComponents/CheckBox';
import Popup from '../../components/UI/PopupWithBorder';
import Textarea from '../../components/FormComponents/Textarea';
import PageTitle from '../../components/SEO/PageTitle';
import MultipleSelectInput from '../../components/FormComponents/MultipleSelectInput';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nativeLanguage: [],
    country: 'Select',
    checkedState: '',
    paymentDetails: '',
  });
  const [loader, setLoader] = useState('');
  const [popupSupport, setPopupSupport] = useState(false);
  const [popupSubmit, setPopupSubmit] = useState(false);
  const [supportData, setSupportData] = useState({ email: '', inquiry: '' });
  const supportedLanguages = useSelector((el) =>
    el.languages.supportedLanguages.map((item) => item.languageName).sort()
  );
  const countriesAndCodes = useSelector((el) =>
    el.languages.countriesAndCodes.map((item) => item.name).sort()
  );
  const paymentOptions = ['Remitly', 'Paypal', 'Xoom'];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoader('submit');
    try {
      const {
        name,
        email,
        nativeLanguage,
        country,
        checkedState,
        paymentDetails,
      } = formData;
      if (
        !name.trim() ||
        !email.trim() ||
        !emailValidator(email.trim()) ||
        nativeLanguage.length === 0 ||
        country === 'Select' ||
        !checkedState ||
        !paymentDetails.trim()
      ) {
        throw new Error('Please fill all fields correctly');
      }

      localStorage.setItem('emailForSignIn', email);

      await createTranslator(
        name.trim(),
        email.trim(),
        nativeLanguage,
        country,
        checkedState,
        paymentDetails.trim()
      );
      setPopupSubmit(true);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoader('');
    }
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    setLoader('support');
    try {
      const { email, inquiry } = supportData;
      if (!emailValidator(email) || !inquiry)
        throw new Error('Please enter valid email and inquiry');
      await sendSupportMessage(email, inquiry);
      toast.success('Inquiry has been sent!');
      setSupportData({ email: '', inquiry: '' });
      setPopupSupport(false);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoader('');
    }
  };

  const handleMultipleLanguages = (option) => {
    const updatedLanguages = formData.nativeLanguage.includes(option)
      ? formData.nativeLanguage.filter((lang) => lang !== option)
      : [...formData.nativeLanguage, option];
    handleInputChange('nativeLanguage', updatedLanguages);
  };

  return (
    <>
      <PageTitle
        title="Onboarding"
        description="Join the league of reviewers servicing and distributing contents globally"
      />
      <header className="w-full pb-s2.5 pt-s4">
        <div className="flex flex-row">
          <div className="flex w-[170px] justify-center">
            <Image
              src={aviewLogo}
              alt="AVIEW International logo"
              width={56}
              height={56}
            />
          </div>
          <div className="pl-s9">
            <h3 className="text-xl">Aview International</h3>
            <p className="text-lg text-gray-2">
              Welcome to Aview reviewer onboarding.
            </p>
          </div>
        </div>
      </header>
      <main>
        <Popup show={popupSubmit} disableClose={true}>
          <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3 text-center">
            <h2 className="mb-s2 text-2xl">Verify email address</h2>
            <p>
              Please check your email inbox to verify and continue, thank you
            </p>
          </div>
        </Popup>
        <Popup show={popupSupport} onClose={() => setPopupSupport(false)}>
          <div className="w-[600px] rounded-2xl bg-indigo-2 p-s2">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-s4 text-2xl">Contact Support</h2>
              <FormInput
                label="Email"
                value={supportData.email}
                placeholder="Your email"
                type="email"
                onChange={(e) =>
                  setSupportData((prev) => ({ ...prev, email: e.target.value }))
                }
                name="Email"
                labelClasses="text-lg !mb-[4px]"
                classes="!mb-s4"
              />
              <h2 className="w-full text-lg">Support Message</h2>
              <Textarea
                placeholder="Your inquiry"
                classes="!mb-s2"
                textAreaClasses="text-lg font-light"
                onChange={(e) =>
                  setSupportData((prev) => ({
                    ...prev,
                    inquiry: e.target.value,
                  }))
                }
              />
              <div className="float-right ml-auto w-[134px] font-semibold">
                <Button
                  theme="light"
                  onClick={handleSupport}
                  isLoading={loader === 'support'}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Popup>

        <div className="float-right mr-[100px] mt-s2 cursor-pointer">
          <a
            className="relative flex items-center rounded-full bg-white-transparent px-s2 py-2.5 text-sm"
            onClick={() => setPopupSupport(true)}
          >
            <span className="mr-s1.5 grid place-content-center brightness-0 invert">
              <Image src={messages} alt="Messages" width={24} height={24} />
            </span>
            <span className="mt-0.5">Support</span>
          </a>
        </div>

        <div className="mx-auto mb-[200px] mt-s5 max-h-screen w-full max-w-[768px] px-4 sm:px-6 lg:px-8">
          <div className="text-center text-6xl font-bold">Work with us</div>
          <div className="mb-s5 mt-s2 text-center text-lg font-normal">
            Sign up today to become a translator and manage content.
          </div>

          <div className="h-full w-full rounded-2xl bg-white-transparent px-s4 pb-s14 pt-s4">
            <div className="text-xl font-bold">Personal Information</div>
            <FormInput
              label="Name"
              placeholder="First and Last Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              name="name"
              labelClasses="text-lg mt-s2 !mb-[4px]"
              valueClasses="text-lg font-light"
              classes="!mb-s2"
            />

            <FormInput
              label="Email"
              value={formData.email}
              placeholder="Your email"
              onChange={(e) => handleInputChange('email', e.target.value)}
              name="email"
              labelClasses="text-lg !mb-[4px]"
              valueClasses="text-lg font-light"
              classes="!mb-s2"
            />

            <MultipleSelectInput
              text="Native Languages"
              answer={formData.nativeLanguage}
              options={supportedLanguages}
              onChange={handleMultipleLanguages}
              labelClasses="!text-lg !mb-[4px]"
              valueClasses="!text-lg ml-s1 font-light"
              classes="!mb-s2"
              hideCheckmark={true}
            />

            <CustomSelectInput
              text="Country"
              value={formData.country}
              options={countriesAndCodes}
              onChange={(selectedOption) =>
                handleInputChange('country', selectedOption)
              }
              labelClasses="text-lg !mb-[px]"
              valueClasses="text-lg ml-s1 font-light"
            />

            <div className="mt-s3 text-xl font-bold">Payment method</div>

            {paymentOptions.map((el, idx) => (
              <div key={idx}>
                <div className="mt-s1">
                  <CheckBox
                    label={el}
                    onChange={() => handleInputChange('checkedState', el)}
                    name="checkbox"
                    labelClasses="text-lg mt-[5px]"
                    isChecked={formData.checkedState === el}
                  />
                </div>

                {formData.checkedState === el && (
                  <FormInput
                    value={formData.paymentDetails}
                    placeholder="Name, username, email"
                    onChange={(e) =>
                      handleInputChange('paymentDetails', e.target.value)
                    }
                    labelClasses="text-lg mt-s2"
                    valueClasses="text-lg font-light"
                    classes="!mb-s2"
                  />
                )}
              </div>
            ))}
            <div className="float-right mt-s4 h-[47px] w-[134px]">
              <Button
                theme="light"
                onClick={handleSubmit}
                isLoading={loader === 'submit'}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <Blobs />
      </main>
    </>
  );
};

export default Onboarding;
